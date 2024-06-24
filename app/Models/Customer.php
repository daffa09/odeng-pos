<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'phone',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function getAvatarUrl()
    {
        return Storage::url($this->avatar);
    }
}
