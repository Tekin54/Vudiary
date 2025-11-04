<template>
  <!-- removed 'fullscreen' because it can cover the app header and block navbar clicks -->
  <div class="column items-center justify-center" style="min-height: calc(100vh - 98px)">
    <q-card class="my-card column justify-center items-center">
      <!-- Avatar Kreis oben -->
      <div class="avatar flex justify-center items-center">
        <Icon class="avatar-icon" icon="material-symbols:person" />
      </div>

      <q-card-section class="q-mt-md" style="width: 100%">
        <div class="text-h3 text-weight-bolder q-mb-md text-center">Login</div>
        <div class="text-subtitle2 text-center q-mb-xl">
          Welcome back! Please enter your credentials to continue.
        </div>

        <div class="text-h6 q-gutter-md">
          <q-input
            v-model="username"
            label="Username / Email"
            outlined
            bg-color="white"
            class="input_fields"
          />
          <q-input
            label="Password"
            outlined
            class="input_fields"
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn class="login-btn" label="Login"></q-btn>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none q-pb-md" style="width: 100%; text-align: center">
        <a class="forgot-text">Forgot Password?</a> </q-card-section
      ><q-card-section class="q-pt-none text-center" style="opacity: 0.6; font-size: 0.85rem">
        © 2025 Tekin Industries
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { ref } from 'vue';
let isPwd = ref(true);
let username = ref('');
let password = ref('');
</script>
<style lang="scss" scoped>
.my-card {
  color: black;
  border-radius: 10px;
  background: white;
  width: 600px;
  height: 550px;
  padding-top: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 100px;
  height: 100px;
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 50% !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-icon {
  width: 60%;
  height: 60%;
  color: #4a90e2;
}

.input_fields {
  border-radius: 25px;
  --q-primary: #4a90e2;
  margin-bottom: 15px;
}

.login-btn {
  background: linear-gradient(135deg, #4bc281 0%, #4a90e2 50%, #2d9866 100%);
  color: white;
  font-weight: bold;
  border-radius: 8px;
  padding: 10px 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;

  &:hover {
    background-color: #357ab8;
  }
  &:active {
    background-color: #2a5f92;
  }
}

.forgot-text {
  margin-top: 10px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  text-decoration: none; /* kein Unterstrich */
  display: inline-block;
  transition: color 0.25s ease, transform 0.25s ease;

  &:hover {
    color: #d4f5d2;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

/* ===== Responsive ===== */
@media (max-width: 600px) {
  .my-card {
    width: 95%;
    height: auto;
    padding: 70px 20px 40px 20px; /* mehr Platz oben für Avatar */
  }

  .avatar {
    width: 80px;
    height: 80px;
    top: -0px;
  }

  .avatar-icon {
    width: 60%;
    height: 60%;
  }

  .input_fields {
    font-size: 0.9rem;
  }

  .login-btn {
    padding: 8px 20px;
    font-size: 0.9rem;
  }

  .text-h3 {
    font-size: 1.5rem;
  }

  .text-subtitle2 {
    font-size: 0.9rem;
  }

  .forgot-text {
    font-size: 0.85rem;
  }
}
</style>
