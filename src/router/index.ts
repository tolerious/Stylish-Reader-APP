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
      path: '/recite/:source',
      name: 'recite',
      component: () => import('@/views/ReciteWord.vue')
    },
    {
      path: '/group-recite',
      name: 'groupRecite',
      component: () => import('@/views/GroupRecite.vue')
    },
    { path: '/wordlist/:groupID', name: 'word', component: () => import('@/views/WordList.vue') },
    {
      path: '/cycling',
      name: 'cycling',
      component: () => import('@/views/Cycling.vue')
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/views/Feedback.vue')
    },
    {
      path: '/record-word',
      name: 'recordWord',
      component: () => import('@/views/RecordWord.vue')
    },
    {
      path: '/group-manage',
      name: 'input',
      component: () => import('@/views/GroupManage.vue')
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/Help.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue')
    }
  ]
})

export default router
