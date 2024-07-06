<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderStoreRequest;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request) {
        $orders = new Order();
        if($request->start_date) {
            $orders = $orders->where('created_at', '>=', $request->start_date);
        }
        if($request->end_date) {
            $orders = $orders->where('created_at', '<=', $request->end_date . ' 23:59:59');
        }
        $orders = $orders->with(['items', 'payments', 'customer'])->latest()->paginate(10);

        $total = $orders->map(function($i) {
            return $i->total();
        })->sum();
        $receivedAmount = $orders->map(function($i) {
            return $i->receivedAmount();
        })->sum();

        return view('orders.index', compact('orders', 'total', 'receivedAmount'));
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
