document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, TextPlugin);
  const params = new URLSearchParams(window.location.search);
  let name = params.get("name");

  if (name) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    document.getElementById("introHello").textContent = `Hello, ${name}!`;
  } else {
    name = "because"; // fallback
  }

  document.getElementById("sec3hiST2").textContent =
    `${name}, it didn't inspire any explicit humor or joy.`;
  gsap.to(".wavingHand", {
    rotation: 15,
    duration: 0.7,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut",
    transformOrigin: "bottom center",
  });

  const sectionAnims = {
    two: (tl) => {
      tl.from("#two .t", {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.out",
      });

      tl.to("#two .t", {
        duration: 2,
        text: "You're probably wondering why you got sent this.",
        ease: "none",
      });

      tl.from("#sec2hiST1", {
        delay: 1,
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      tl.from("#sec2hiST2", {
        delay: 0.3,
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      tl.from("#progress2", {
        delay: 0.3,
        y: 40,
        opacity: 0,
        filter: "blur(15px)",
        duration: 1,
        ease: "power2.out",
      });
    },
    three: (tl) => {
      tl.from("#three .t", {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.out",
      });

      tl.to("#three .t", {
        duration: 0.5,
        text: "My Advice:",
        ease: "none",
      });

      tl.from("#sec3hiST1", {
        delay: 1,
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      tl.from("#sec3hiST2", {
        delay: 0.8,
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      tl.from("#copyBtn", {
        delay: 0.3,
        y: 40,
        opacity: 0,
        duration: 1,
        filter: "blur(15px)",
        ease: "power2.out",
      });

      tl.from("#credits", {
        delay: 0.3,
        x: 40,
        opacity: 0,
        duration: 1,
        filter: "blur(15px)",
        ease: "power2.out",
      });
    },
  };

  let isTransitioning = false;

  function switchSection(from, to) {
    if (!from || !to || from === to || isTransitioning) return;

    isTransitioning = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioning = false;
      },
    });

    tl.to(from, {
      autoAlpha: 0,
      duration: 0.5,
      onComplete: () => from.classList.add("disabled"),
    });

    tl.fromTo(
      to,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.5,
        onStart: () => to.classList.remove("disabled"),
      },
    );

    if (sectionAnims[to.id]) {
      sectionAnims[to.id](tl);
    }
  }

  function getActiveSection() {
    return document.querySelector("section:not(.disabled)");
  }

  function showSectionByHash() {
    const id = location.hash.replace("#", "") || "one";
    const target = document.getElementById(id);
    const current = getActiveSection();

    if (!target) return;

    if (!current) {
      target.classList.remove("disabled");
      return;
    }

    switchSection(current, target);
  }

  function goTo(id) {
    if (location.hash === "#" + id) return;
    location.hash = id;
  }

  document.getElementById("progress1").addEventListener("click", () => {
    goTo("two");
  });

  document.getElementById("progress2").addEventListener("click", () => {
    goTo("three");
  });

  window.addEventListener("hashchange", showSectionByHash);

  if (!location.hash) {
    location.hash = "one";
  } else {
    showSectionByHash();
  }

  const copyBtn = document.getElementById("copyBtn");

  copyBtn.addEventListener("click", async () => {
    const url = new URL(window.location.href);

    url.hash = "";
    url.searchParams.delete("name");

    const cleanUrl = url.toString();

    try {
      await navigator.clipboard.writeText(cleanUrl);

      copyBtn.innerHTML = `copied<br>(tip: send "${cleanUrl}?name=Name" for a personalised touch.)`;

      setTimeout(() => {
        copyBtn.innerHTML = `copy link`;
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  });
});
