@extends('layouts.admin')

@section('title', __('order.Orders_List'))
@section('content-header', __('order.Orders_List'))
@section('content-actions')
    <a href="{{route('cart.index')}}" class="btn btn-primary">{{ __('cart.title') }}</a>
@endsection

@section('content')
<div class="card">
    <div class="card-body">
        <div class="row">
            <div class="col-md-7"></div>
            <div class="col-md-5">
                <form action="{{route('orders.index')}}">
                    <div class="row">
                        <div class="col-md-5">
                            <input type="date" name="start_date" class="form-control" value="{{request('start_date')}}" />
                        </div>
                        <div class="col-md-5">
                            <input type="date" name="end_date" class="form-control" value="{{request('end_date')}}" />
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-primary" type="submit">{{ __('order.submit') }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nama Customer</th>
                    <th>Total Harga</th>
                    <th>Total Bayar</th>
                    <th>Kembalian</th>
                    <th>Metode Pembayaran</th>
                    <th>Tanggal</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($orders as $order)
                <tr>
                   <td>{{ $order->id }}</td>
                   <td>{{ $order->customer_name }}</td>
                   <td>Rp. {{ number_format($order->detail->sum('price')) }}</td>
                   <td>Rp. {{ number_format($order->total_bayar) }}</td>
                   <td>{{ number_format($order->kembalian) }}</td>
                   <td>
                       @if($order->payment_method == "cash")
                       <span class="badge badge-success">{{ $order->payment_method }}</span>
                       @elseif($order->payment_method == "bank")
                       <span class="badge badge-info">{{ $order->payment_method }}</span>
                       @endif
                    </td>
                    <td>{{ $order->created_at }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <th></th>
                    <th></th>
                    <th>Rp. {{ number_format($total_harga) }}</th>
                    <th>Rp. {{ number_format($total_bayar) }}</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
@endsection

