import React, { Component } from "react";
import { createRoot } from "react-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { sum } from "lodash";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            products: [],
            customers: "walkin customer",
            payment_method: "cash",
            code: "",
            search: "",
            translations: {},
        };

        this.loadCart = this.loadCart.bind(this);
        this.handleOnChangecode = this.handleOnChangecode.bind(this);
        this.handleScanCode = this.handleScanCode.bind(this);
        this.handleChangeQty = this.handleChangeQty.bind(this);
        this.handleEmptyCart = this.handleEmptyCart.bind(this);

        this.loadProducts = this.loadProducts.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.setPaymentMethod = this.setPaymentMethod.bind(this);
        this.setCustomer = this.setCustomer.bind(this);
        this.handleClickSubmit = this.handleClickSubmit.bind(this);
        this.loadTranslations = this.loadTranslations.bind(this);
    }

    componentDidMount() {
        // load user cart
        this.loadTranslations();
        this.loadCart();
        this.loadProducts();
    }

    // load the transaltions for the react component
    loadTranslations() {
        axios
            .get("/admin/locale/cart")
            .then((res) => {
                const translations = res.data;
                this.setState({ translations });
            })
            .catch((error) => {
                console.error("Error loading translations:", error);
            });
    }

    loadProducts(search = "") {
        const query = !!search ? `?search=${search}` : "";
        axios.get(`/admin/products${query}`).then((res) => {
            const products = res.data.data;
            this.setState({ products });
        });
    }

    handleOnChangecode(event) {
        const code = event.target.value;
        this.setState({ code });
    }

    loadCart() {
        axios.get("/admin/cart").then((res) => {
            const cart = res.data;
            this.setState({ cart });
        });
    }

    handleScanCode(event) {
        event.preventDefault();
        const { code } = this.state;
        if (!!code) {
            axios
                .post("/admin/cart", { code })
                .then((res) => {
                    this.loadCart();
                    this.setState({ code: "" });
                })
                .catch((err) => {
                    Swal.fire("Error!", err.response.data.message, "error");
                });
        }
    }
    handleChangeQty(product_id, qty) {
        const cart = this.state.cart.map((c) => {
            if (c.id === product_id) {
                c.pivot.qty = qty;
            }
            return c;
        });

        this.setState({ cart });
        if (!qty) return;
    }

    getTotal(cart) {
        const total = cart.map((c) => c.pivot.qty * c.price);
        return sum(total).toFixed(2);
    }

    handleClickDelete(product_id) {
        const cart = this.state.cart.filter((c) => c.id !== product_id);
        this.setState({ cart });
    }

    handleEmptyCart() {
        this.setState({ cart: [] });
    }

    handleChangeSearch(event) {
        const search = event.target.value;
        this.setState({ search });
        this.loadProducts(search);
    }

    addProductToCart(code) {
        let product = this.state.products.find((p) => p.code === code);
        if (!!product) {
            // if product is already in cart
            let cart = this.state.cart.find((c) => c.id === product.id);

            if (!!cart) {
                // update stock
                this.setState({
                    cart: this.state.cart.map((c) => {
                        if (
                            c.id === product.id &&
                            product.stock > c.pivot.qty
                        ) {
                            c.pivot.qty = c.pivot.qty + 1;
                        }
                        return c;
                    }),
                });
            } else {
                if (product.stock > 0) {
                    product = {
                        ...product,
                        pivot: {
                            qty: 1,
                            product_id: product.id,
                            user_id: 1,
                        },
                    };

                    this.setState({ cart: [...this.state.cart, product] });
                }
            }
        }
    }

    setCustomer(event) {
        this.setState({ customers: event.target.value });
    }

    setPaymentMethod(event) {
        this.setState({ payment_method: event.target.value });
    }

    handleClickSubmit() {
        const isCash = this.state.payment_method === "cash";

        const formatNumber = (number) => {
            return new Intl.NumberFormat("id-ID").format(number);
        };

        const parseNumber = (str) => {
            const parsedValue = parseInt(str.replace(/\./g, ""), 10);
            return isNaN(parsedValue) ? 0 : parsedValue;
        };

        Swal.fire({
            title: this.state.translations["received_amount"],
            input: "text",
            inputValue: formatNumber(this.getTotal(this.state.cart)),
            inputAttributes: isCash ? {} : { disabled: true },
            cancelButtonText: this.state.translations["cancel_pay"],
            showCancelButton: true,
            confirmButtonText: this.state.translations["confirm_pay"],
            showLoaderOnConfirm: true,
            html: `
            <div>
                ${
                    !isCash
                        ? `<input type="checkbox" id="confirmCheckbox"> Sudah Transfer?`
                        : ""
                }
            </div>
        `,
            preConfirm: (amount) => {
                if (
                    !isCash &&
                    !document.getElementById("confirmCheckbox").checked
                ) {
                    Swal.showValidationMessage(
                        this.state.translations["please_confirm"]
                    );
                    return false;
                }

                const harga = parseInt(this.getTotal(this.state.cart));
                const bayar = parseNumber(amount);
                const kembalian = bayar > harga ? bayar - harga : 0;
                const formattedKembalian = new Intl.NumberFormat(
                    "id-ID"
                ).format(kembalian);

                return axios
                    .post("/admin/orders", {
                        customer_name: this.state.customers,
                        cart: this.state.cart,
                        payment_method: this.state.payment_method,
                        bayar,
                        harga: harga,
                        kembalian: kembalian,
                    })
                    .then((res) => {
                        this.loadCart();
                        Swal.fire({
                            title: "Berhasil!",
                            text: isCash
                                ? `Kembalian: Rp. ${formattedKembalian}`
                                : "Pesanan Berhasil", // Menggunakan template literal untuk menyertakan nilai variabel kembalian jika isCash true
                            icon: "success",
                        });

                        return res.data;
                    })
                    .catch((err) => {
                        Swal.showValidationMessage(err.response.data.message);
                    });
            },
            willOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                if (!isCash) {
                    confirmButton.disabled = true;
                    document
                        .getElementById("confirmCheckbox")
                        .addEventListener("change", function () {
                            confirmButton.disabled = !this.checked;
                        });
                }

                const input = Swal.getInput();
                input.addEventListener("input", function () {
                    const cursorPosition = input.selectionStart;
                    const valueBeforeFormatting = input.value.replace(
                        /\./g,
                        ""
                    );
                    const formattedValue = formatNumber(
                        parseNumber(valueBeforeFormatting)
                    );
                    input.value = formattedValue ? formattedValue : 0;

                    // Update cursor position
                    const diff =
                        formattedValue.length - valueBeforeFormatting.length;
                    input.setSelectionRange(
                        cursorPosition + diff,
                        cursorPosition + diff
                    );
                });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            console.log(result.value);
        });
    }

    render() {
        const { cart, products, translations, customers } = this.state;
        return (
            <div className="row">
                <div className="col-md-6 col-lg-4">
                    <div className="row mb-2">
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                name="customer_name"
                                placeholder="Customer Name"
                                value={this.state.customerName || customers}
                                onChange={this.setCustomer}
                            />
                        </div>
                        <div className="col">
                            <select
                                className="form-control"
                                value={this.state.payment_method}
                                onChange={this.setPaymentMethod}
                            >
                                <option value="cash">Cash</option>
                                <option value="bank">Bank</option>
                            </select>
                        </div>
                    </div>
                    <div className="user-cart">
                        <div className="card">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Stock</th>
                                        <th className="text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((c) => (
                                        <tr key={c.id}>
                                            <td>{c.name}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm qty"
                                                    value={c.pivot.qty}
                                                    onChange={(event) =>
                                                        this.handleChangeQty(
                                                            c.id,
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                                <button
                                                    className="btn btn-danger btn-sm ml-2"
                                                    onClick={() =>
                                                        this.handleClickDelete(
                                                            c.id
                                                        )
                                                    }
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                            <td className="text-right">
                                                {window.APP.currency_symbol}{" "}
                                                {(c.price * c.pivot.qty)
                                                    .toFixed(2)
                                                    .replace(/\.00$/, "")
                                                    .replace(
                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                        "."
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">{translations["total"]}:</div>
                        <div className="col text-right">
                            {window.APP.currency_symbol}{" "}
                            {parseFloat(this.getTotal(cart))
                                .toFixed(2)
                                .replace(/\.00$/, "")
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <button
                                type="button"
                                className="btn btn-danger btn-block"
                                onClick={this.handleEmptyCart}
                                disabled={!cart.length}
                            >
                                {translations["cancel"]}
                            </button>
                        </div>
                        <div className="col">
                            <button
                                type="button"
                                className="btn btn-primary btn-block"
                                disabled={!cart.length}
                                onClick={this.handleClickSubmit}
                            >
                                {translations["checkout"]}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-lg-8">
                    <div className="mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={translations["search_product"] + "..."}
                            onChange={this.handleChangeSearch}
                        />
                    </div>
                    <div className="order-product">
                        {products.map((p) => (
                            <div
                                onClick={() => this.addProductToCart(p.code)}
                                key={p.id}
                                className="item p-3"
                                style={{ cursor: "pointer" }}
                            >
                                <p
                                    className="mb-0 font-bold text-lg text-bold"
                                    style={
                                        window.APP.warning_quantity > p.stock
                                            ? { color: "red" }
                                            : {}
                                    }
                                >
                                    {p.name}
                                </p>
                                <p className="mb-0 !font-bold">
                                    Qty :{" "}
                                    {parseInt(p.stock)
                                        .toFixed(2)
                                        .replace(/\.00$/, "")
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                </p>
                                <p className="mb-0 !font-bold">
                                    {window.APP.currency_symbol}
                                    {parseFloat(p.price)
                                        .toFixed(2)
                                        .replace(/\.00$/, "")
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart;

const root = document.getElementById("cart");
if (root) {
    const rootInstance = createRoot(root);
    rootInstance.render(<Cart />);
}
