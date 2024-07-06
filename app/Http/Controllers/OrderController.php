<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Transaction::with('detail')->get()->sortDesc();

        if ($request->start_date) {
            $orders = $orders->where('created_at', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $orders = $orders->where('created_at', '<=', $request->end_date . ' 23:59:59');
        }

        $total_harga = $orders->map(function ($i) {
            return $i->total_harga();
        })->sum();

        $total_bayar =  $orders->sum('total_bayar');

        return view('orders.index',  compact('orders', 'total_bayar', 'total_harga'));
    }

    public function store(OrderStoreRequest $request)
    {
        $transaction = Transaction::create([
            'user_id' => $request->user()->id,
            'customer_name' => $request->customer_name,
            'total_bayar' => $request->bayar,
            'kembalian' => $request->kembalian,
            'payment_method' => $request->payment_method,
        ]);

        $cart = $request["cart"];

        foreach ($cart as $item) {
            $transaction->detail()->create([
                'price' => (int)$item["price"] * (int)$item["pivot"]["qty"],
                'quantity' => $item["pivot"]["qty"],
                'product_id' => $item["id"]
            ]);

            $product = Product::find($item["id"]);
            $product->stock = $item["stock"] - $item["pivot"]["qty"];
            $product->save();
        }

        return 'success';
    }
}
