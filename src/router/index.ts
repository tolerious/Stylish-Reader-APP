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
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/recite',
      name: 'recite',
      component: () => import('@/views/ReciteWord.vue')
    },
    {
      path: '/group',
      name: 'wordGroup',
      component: () => import('@/views/WordGroup.vue')
    },
    {
      path: '/cycling',
      name: 'cycling',
      component: () => import('@/views/Cycling.vue')
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/views/Feedback.vue')
    }
  ]
})

export default router
