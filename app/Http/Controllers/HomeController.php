<?php

namespace App\Http\Controllers;

use App\Models\Transaction;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $orders = Transaction::with(['user', 'detail'])->get();

        return view('home', [
            'orders_count' => $orders->count(),
            'income' => $orders->sum(function ($order) {
                return $order->total_bayar - $order->kembalian;
            }),
            'income_today' => $orders->where('created_at', '>=', now()->startOfDay())
                ->sum(function ($order) {
                    return $order->total_bayar - $order->kembalian;
                }),
        ]);
    }
}
