<template>
    <main class="grid-container">
        <div class="sticky-frame">
            <header class="hero-section">
                <div class="hero-image-wrapper">
                    <NuxtImg ref="imageRef" src="/images/chinese-gate.png" alt="Chinese Shrine Gate Hero Background"
                        class="hero-bg" loading="lazy" />
                </div>
                <section class="hero-copy">
                    <h1 class="logo-lockup">
                        <span class="app-logo"><span class="font-zh">真</span> / Zhen Chinese</span>
                    </h1>
                    <h2 class="headline">
                        Master the language.<br />Experience the structure.
                    </h2>
                    <div class="scroll-down-indicator">
                        <div class="indicator"></div>
                        <p class="scroll-text">Scroll Down</p>
                    </div>
                </section>
            </header>
        </div>
    </main>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

let ctx;

onMounted(() => {
    // Register plugin on the client side
    gsap.registerPlugin(ScrollTrigger)

    // Wrap animations in gsap.context() for easy cleanup
    ctx = gsap.context(() => {
        gsap.to(".hero-image-wrapper", {
            height: '150vh',
            scrollTrigger: {
                trigger: ".sticky-frame",
                start: "top top",
                end: "+=2000",
                pin: true,
                scrub: 1
            }
        })

    }) // scope can be passed here if you want to scope selectors to a specific ref
})

onUnmounted(() => {
    // Reverts the DOM and kills the ScrollTrigger when leaving the page
    if (ctx) ctx.revert()
})
</script>

<style>
.grid-container {
    overflow: hidden;
}
.sticky-frame {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
}

.hero-image-wrapper {
    overflow: hidden;
    position: absolute;
    height: 85vh;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
}

.hero-bg {
    object-position: bottom;
}

.hero-image-wrapper::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0) 100%);
}

header.hero-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.hero-copy {
    margin-bottom: 50px;
    transform: translateY(100px);
}

h1.logo-lockup {
    font-size: 160px;
    font-weight: 100;
    color: var(--text-primary);
    text-align: center;
    margin-bottom: 50px;
}

h2.headline {
    text-align: center;
    font-size: 40px;
    color: var(--text-primary);
    margin-bottom: 50px;
}

.scroll-down-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.indicator {
    position: relative;
    width: 40px;
    height: 80px;
    border: 3px solid var(--text-primary);
    border-bottom: 0;
    margin-bottom: 30px;
    animation: bounce 2s infinite;
}

.scroll-text {
    font-size: 30px;
    color: var(--text-primary);
}

.indicator::after {
    content: '';
    display: block;
    position: absolute;
    width: 12px;
    height: 12px;
    left: 11px;
    /* Precision Sharp Edges & Shrine Crimson Fill */
    background-color: var(--text-primary);

    /* Trigger Keyframe Animation */
    animation: squareRiseLoop 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes squareRiseLoop {
    0% {
        opacity: 0;
        top: calc(100% - 22px);
        bottom: 11px;
    }

    30% {
        opacity: 1;
    }

    70% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        top: 11px;
    }
}
</style>