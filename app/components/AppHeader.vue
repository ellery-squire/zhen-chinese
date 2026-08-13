<template>
    <nav class="app-header">
        <div class="logo">
            <NuxtLink to="/"><span class="font-zh">真</span> / Zhen Chinese</NuxtLink>
        </div>
        <ul class="nav-links">
            <li><NuxtLink to="/">Home</NuxtLink></li>
            <li><NuxtLink to="/showcase">Showcase</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
            <li><NuxtLink to="/blog">Blog</NuxtLink></li>
        </ul>
    </nav>
</template>

<style>
.app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    font-size: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:50px 140px;
    color: var(--text-primary);
    z-index: 1000;
  
  /* 2. Backdrop blur & saturation boost (Apple-style vividness) */
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  backdrop-filter: blur(12px) saturate(180%);
  
  /* Smooth performance hint for GPUs */
  will-change: transform;
}
ul.nav-links {
    list-style: none;
    display: flex;
    gap: 30px;
}
ul.nav-links li {
    position: relative;
}
ul.nav-links li a::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -10px;
    left: 50%;
    right: 50%;
    /* transform: translateX(-50%); */
    height: 3px;
    transition: var(--trans-fast);
}
ul.nav-links li a:hover::after {
    left: 0;
    right: 0;
    background-color: var(--accent-crimson);
}
</style>