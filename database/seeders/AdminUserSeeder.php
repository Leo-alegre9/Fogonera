<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the single administrator account for the questionnaire panel.
     */
    public function run(): void
    {
        $email = config('cuestionario.admin_email');
        $password = config('cuestionario.admin_password');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Administrador',
                'password' => Hash::make($password),
            ]
        );

        $this->command?->info("Administrador sembrado: {$email} / {$password}");
    }
}
