<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailTransaction extends Model
{
    use HasFactory;

    protected $table = 'detail_transaction';

    protected $fillable = [
        'price', 'quantity', 'transaction_id', 'product_id'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
