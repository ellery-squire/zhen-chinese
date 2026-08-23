<template>
    <main class="grid-container" ref="mainScope">
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
            <section class="welcome-section">
                <h3 class="welcome-title">Welcome</h3>
                <div class="welcome-buttons-wrapper">
                    <WelcomeSectionButton class="showcase" zhTitle="展示" enTitle="Showcase" toPage="/showcase" />
                    <WelcomeSectionButton class="contact" zhTitle="联系" enTitle="Contact" toPage="/contact" />
                    <WelcomeSectionButton class="blog" zhTitle="博客" enTitle="Blog" toPage="/blog" />
                </div>
            </section>
        </div>
    </main>
    <section class="about-the-designer">
        <div class="description">
            <h3 class="about-the-designer-title">About the designer</h3>
            <p class="about-the-designer-text">Hi, I'm Arian, a passionate web designer and developer with a love for
                creating beautiful and functional websites. I designed this website in order to help people learn
                Chinese more
                effectively.</p>
            <TextButton to-page="/contact" text="Contact" />
        </div>
        <div class="designer-image-wrapper">
            <div class="monochrome arian">
                <NuxtImg src="/images/atd-monochrome.png" alt="Designer Image" class="designer-image" loading="lazy" />
            </div>
            <div class="colorful arian">
                <NuxtImg src="/images/atd-colorful.png" alt="Designer Image" class="designer-image" loading="lazy" />
            </div>
        </div>
    </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// 1. Create a ref for your main wrapper (add ref="mainScope" to your outermost div)
const mainScope = ref(null)
let ctx;

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)

    // 2. Pass the ref here so GSAP only targets classes inside this specific component
    ctx = gsap.context(() => {

        // Replace your existing autoTl with this:
        const autoTl = gsap.timeline({ paused: true });

        autoTl
            .set([".logo-lockup", ".headline", ".scroll-down-indicator"], { filter: "blur(0px)" })
            .to(".logo-lockup", { autoAlpha: 0, filter: "blur(30px)", stagger: 0.2, duration: 0.3, ease: "power1.out" }, "-=0.1")
            .to(".headline", { autoAlpha: 0, filter: "blur(30px)", stagger: 0.2, duration: 0.3, ease: "power1.out" }, "-=0.1")
            .to(".scroll-down-indicator", { autoAlpha: 0, filter: "blur(30px)", stagger: 0.2, duration: 0.3, ease: "power1.out" }, "-=0.1")

            // Animate to autoAlpha 0 (which handles visibility: hidden automatically)
            .to(".hero-section", { autoAlpha: 0, duration: 0.3 }, "-=0.1")

            // Prep the incoming sections. 
            // We set opacity to 0 first, but ensure display is flex so they take up space
            .set([".welcome-section", ".showcase", ".contact", ".blog"], { display: "flex", filter: "blur(30px)", opacity: 0 })

            // Fade them all in
            .to(".welcome-section", { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power1.out" })
            .to(".showcase", { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power1.out" }, "-=0.1")
            .to(".contact", { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power1.out" }, "-=0.1")
            .to(".blog", { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power1.out" }, "-=0.1")

        gsap.set(".logo-lockup", { autoAlpha: 1, filter: "blur(0px)" })

        // --- STEP B: CREATE SCRUBBED ANIMATION ---
        // Do this BEFORE the pin, so GSAP can calculate its position accurately
        gsap.to(".hero-image-wrapper", {
            scale: 3,
            opacity: 0,
            scrollTrigger: {
                trigger: ".sticky-frame",
                start: "top top",
                end: "+=1000",
                scrub: true,
                onLeave: () => autoTl.play(),
                onEnterBack: () => autoTl.reverse()
            }
        });

        // --- STEP C: CREATE THE PIN LAST ---
        ScrollTrigger.create({
            trigger: ".sticky-frame",
            start: "top top",
            end: "+=2000",
            pin: true,
        });

    }, mainScope.value) // <-- Connects to your template ref
})

onUnmounted(() => {
    if (ctx) ctx.revert()
})
</script>

<style lang="scss">
main.grid-container {
    position: relative;
    overflow: hidden;
    left: 0;
    right: 0;
    top: 0;

    .sticky-frame {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 0;
        left: 0;
        right: 0;
        height: 100vh;

        header.hero-section {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        section.hero-copy {
            margin-bottom: 50px;
            transform: translateY(100px);

            h1.logo-lockup {
                will-change: transform, opacity, filter;
                font-size: 160px;
                font-weight: 100;
                color: var(--text-primary);
                text-align: center;
                margin-bottom: 50px;
            }

            h2.headline {
                will-change: transform, opacity, filter;
                text-align: center;
                font-size: 40px;
                color: var(--text-primary);
                margin-bottom: 50px;
            }

            .scroll-down-indicator {
                will-change: transform, opacity, filter;
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
                animation: squareRiseLoop 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
        }
    }

    .hero-image-wrapper {
        will-change: transform, opacity, filter;
        overflow: hidden;
        position: absolute;
        height: 85vh;
        transform-origin: bottom center;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(0deg, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0) 100%);
        }

        .hero-bg {
            object-position: bottom;
        }
    }
}

section.welcome-section {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100vh;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h3.welcome-title {
        margin-top: 150px;
        font-size: 80px;
        margin-bottom: 100px;
        color: var(--text-primary);
    }

    .welcome-buttons-wrapper {
        width: 100%;
        padding: 0 200px;
        display: flex;
        justify-content: space-between;
    }
}

section.about-the-designer {
    margin-top: 180px;
    padding: 0 200px;
    height: 100vh;
    display: flex;
    justify-content: space-between;

    .description {
        display: flex;
        flex-direction: column;

        .about-the-designer-title {
            font-size: 80px;
            margin-bottom: 130px;
            color: var(--text-primary);
        }

        .about-the-designer-text {
            font-size: 30px;
            color: var(--text-primary);
            max-width: 35vw;
            margin-bottom: 130px;
        }
    }

    .designer-image-wrapper {
        position: relative;
        min-width: 30vw;
        min-height: 50vh;
        max-width: 550px;
        max-height: 670px;
        overflow: hidden;
        transform: scale(-1, 1);


        .arian {
            width: 100%;
            height: 100%;
        }

        .designer-image {
            display: inline-block;
            object-fit: cover;
            object-position: center;
        }
    }
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