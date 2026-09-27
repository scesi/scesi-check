import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-off-white px-4 py-10">
      <div class="w-full max-w-md rounded-2xl border border-[#e7e7e7] bg-white p-6 shadow-md">
        <div class="mb-6 text-center">
          <img src="/logo.svg" alt="check logo" class="mx-auto h-11 w-auto" />
        </div>

        <router-outlet />
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}
