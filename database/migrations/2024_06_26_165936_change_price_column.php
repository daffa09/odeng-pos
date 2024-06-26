<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('detail_trasaction', function (Blueprint $table) {
            $table->decimal('price', 14, 4)->change();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 14, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('detail_transaction', function (Blueprint $table) {
            //
        });
        Schema::table('payments', function (Blueprint $table) {
            //
        });
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
};
