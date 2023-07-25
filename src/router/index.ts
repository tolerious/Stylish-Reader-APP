import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/UserLogin.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/',
      name: 'recite',
      component: () => import('@/views/ReciteWord.vue')
    }
  ]
})

export default router
