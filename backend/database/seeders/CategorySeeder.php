<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'music', 'display_name' => 'Music'],
            ['name' => 'sports', 'display_name' => 'Sports'],
            ['name' => 'technology', 'display_name' => 'Technology'],
            ['name' => 'art', 'display_name' => 'Art & Culture'],
            ['name' => 'business', 'display_name' => 'Business'],
            ['name' => 'gaming', 'display_name' => 'Gaming'],
            ['name' => 'film', 'display_name' => 'Film & Entertainment'],
        ];

        DB::table('categories')->insert($categories);
    }
}

