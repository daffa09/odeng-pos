<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Role::updateOrCreate([
            'name' => 'admin'
        ], [
            'name' => 'admin',
        ]);
        $this->call(UserSeeder::class);
        $this->call(SettingsSeeder::class);
    }
}
