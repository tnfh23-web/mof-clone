// 헤더, 슬라이드 조작, 자주찾는 메뉴 탭을 연결합니다.
(() => {
  const header = document.querySelector(".mof-header");
  const navButtons = [...header.querySelectorAll(".mof-nav-trigger")];
  const backdrop = document.querySelector(".mof-menu-backdrop");
  const sitemap = document.querySelector(".mof-sitemap");
  const sitemapOpen = header.querySelector(".mof-sitemap-open");
  const zoomButton = header.querySelector(".mof-zoom-trigger");
  const zoomMenu = header.querySelector(".mof-zoom-menu");
  let openMenuIndex = -1;

  function closeZoom() {
    zoomButton.setAttribute("aria-expanded", "false");
    zoomMenu.hidden = true;
  }

  function openMenu(index, restoreFocus = false) {
    const previousButton = navButtons[openMenuIndex];
    openMenuIndex = index;
    navButtons.forEach((button, buttonIndex) => {
      const isOpen = buttonIndex === index;
      button.setAttribute("aria-expanded", String(isOpen));
      document.getElementById(button.getAttribute("aria-controls")).hidden = !isOpen;
    });
    backdrop.hidden = index === -1;
    if (index !== -1) closeZoom();
    if (restoreFocus && previousButton) previousButton.focus();
  }

  navButtons.forEach((button, index) => {
    button.addEventListener("click", () => openMenu(openMenuIndex === index ? -1 : index));
    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openMenu(index);
        document.getElementById(button.getAttribute("aria-controls"))
          .querySelector('[role="tab"][aria-selected="true"]').focus();
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const offset = event.key === "ArrowRight" ? 1 : -1;
        navButtons[(index + offset + navButtons.length) % navButtons.length].focus();
      }
    });
  });

  header.querySelectorAll(".mof-menu-categories").forEach((categoryList) => {
    const tabs = [...categoryList.querySelectorAll('[role="tab"]')];
    function selectTab(activeTab) {
      tabs.forEach((tab) => {
        const selected = tab === activeTab;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
      });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectTab(tab));
      tab.addEventListener("keydown", (event) => {
        let nextIndex;
        if (event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (nextIndex !== undefined) {
          event.preventDefault();
          selectTab(tabs[nextIndex]);
          tabs[nextIndex].focus();
        }
      });
    });
  });

  backdrop.addEventListener("click", () => openMenu(-1, true));
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      openMenu(-1);
      closeZoom();
    } else if (!event.target.closest(".mof-zoom")) {
      closeZoom();
    }
  });
  header.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) {
      openMenu(-1);
      closeZoom();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (openMenuIndex !== -1) openMenu(-1, true);
    if (!zoomMenu.hidden) {
      closeZoom();
      zoomButton.focus();
    }
  });

  let previousOverflow;
  sitemapOpen.addEventListener("click", () => {
    openMenu(-1);
    closeZoom();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sitemap.showModal();
    sitemapOpen.setAttribute("aria-expanded", "true");
    sitemap.querySelector(".sitemap-list > li > .tit").focus();
  });
  sitemap.querySelector(".mof-sitemap-close").addEventListener("click", () => sitemap.close());
  sitemap.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    sitemapOpen.setAttribute("aria-expanded", "false");
    sitemapOpen.focus();
  });

  // 화면 크기 메뉴. 전체메뉴는 화면에 맞게 표시되도록 별도로 배율을 상쇄합니다.
  zoomButton.addEventListener("click", () => {
    const isOpen = zoomButton.getAttribute("aria-expanded") === "true";
    openMenu(-1);
    zoomButton.setAttribute("aria-expanded", String(!isOpen));
    zoomMenu.hidden = isOpen;
  });
  function setZoom(value) {
    document.body.style.zoom = value === 1 ? "" : String(value);
    sitemap.style.zoom = value === 1 ? "" : String(1 / value);
    zoomMenu.querySelectorAll("[data-zoom]").forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.zoom) === value));
    });
    closeZoom();
    zoomButton.focus();
  }
  zoomMenu.querySelectorAll("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => setZoom(Number(button.dataset.zoom)));
  });
  zoomMenu.querySelector(".mof-zoom-reset").addEventListener("click", () => setZoom(1));

  const search = header.querySelector(".mof-search");
  const searchInput = search.querySelector("input[name='surfWord']");
  search.addEventListener("submit", (event) => {
    // 클론 페이지에서는 외부 검색이나 페이지 이동을 하지 않습니다.
    event.preventDefault();
    searchInput.value = searchInput.value.trim();
    if (!searchInput.value) {
      event.preventDefault();
      searchInput.setCustomValidity("검색어를 입력해 주세요.");
      searchInput.reportValidity();
    }
  });
  searchInput.addEventListener("input", () => searchInput.setCustomValidity(""));

  // 본문 구조를 바꾸지 않고 본문 바로가기의 키보드 초점만 연결합니다.
  const main = document.querySelector("main");
  main.id = "mof-main-content";
  main.tabIndex = -1;
  document.querySelector(".mof-skip-link").addEventListener("click", (event) => {
    event.preventDefault();
    main.focus();
  });
  const updateHeaderHeight = () => {
    document.body.style.setProperty("--mof-header-height", `${header.offsetHeight}px`);
  };
  new ResizeObserver(updateHeaderHeight).observe(header);
  updateHeaderHeight();
  matchMedia("(max-width: 700px)").addEventListener("change", () => openMenu(-1));

  // 사용자가 정지한 슬라이드는 이전 / 다음을 눌러도 자동 재생하지 않습니다.
  const sliders = [
    [".sec-1-main-swiper", ".main-prev", "메인 배너"],
    [".sec-1-sub-swiper", ".sub-prev", "사진뉴스"],
    [".sec-2-left-swiper", ".sec-2-left-prev", "바다소통"],
    [".sec-2-right-swiper", ".sec-2-right-prev", "알림판"],
    [".sec-3-left-swiper", ".sec-3-left-prev", "동영상"],
    [".sec-5-swiper", ".sec-5-prev", "배너모음"],
  ];
  sliders.forEach(([selector, previousSelector, label], index) => {
    const element = document.querySelector(selector);
    const swiper = element?.swiper;
    const previous = document.querySelector(previousSelector);
    if (!swiper?.autoplay || !previous) return;

    [previous, document.querySelector(previousSelector.replace("prev", "next"))].forEach((arrow, direction) => {
      if (!arrow) return;
      arrow.classList.add("mof-slide-arrow", direction ? "mof-slide-next" : "mof-slide-prev");
      if (index === 0) arrow.classList.add("mof-slide-arrow-main");
      if (index === 5) arrow.classList.add("mof-slide-arrow-banner");
      arrow.setAttribute("aria-label", `${label} ${direction ? "다음" : "이전"} 슬라이드`);
      arrow.title = arrow.getAttribute("aria-label");
    });

    element.id = element.id || `mof-slider-${index + 1}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mof-autoplay";
    button.setAttribute("aria-controls", element.id);
    const updateButton = () => {
      const stopped = !swiper.autoplay.running;
      const text = `${label} 자동재생 ${stopped ? "시작" : "정지"}`;
      button.setAttribute("aria-pressed", String(stopped));
      button.setAttribute("aria-label", text);
      button.title = text;
    };
    button.addEventListener("click", () => {
      if (swiper.autoplay.running) swiper.autoplay.stop();
      else swiper.autoplay.start();
      updateButton();
    });
    swiper.on("autoplayStart", updateButton);
    swiper.on("autoplayStop", updateButton);
    previous.insertAdjacentElement(selector === ".sec-5-swiper" ? "beforebegin" : "afterend", button);
    updateButton();
  });

  // 원본처럼 클릭한 탭의 목록만 보여주고, 항목별 등장 효과를 적용합니다.
  const quickMenu = document.querySelector(".sec-4 .quick-area");
  const quickTabs = [...quickMenu.querySelectorAll(".btn-quick-tab")];
  function selectQuickTab(selected) {
    quickTabs.forEach((tab) => {
      const active = tab === selected;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      panel.classList.toggle("active", active);
      panel.setAttribute("aria-hidden", String(!active));
      panel.inert = !active;
    });
    const content = quickMenu.querySelector(".section-con");
    content.classList.toggle("type-a", selected.dataset.type === "A");
    content.classList.toggle("type-b", selected.dataset.type === "B");
  }
  quickTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectQuickTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (index + 1) % quickTabs.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (index - 1 + quickTabs.length) % quickTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = quickTabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      selectQuickTab(quickTabs[nextIndex]);
      quickTabs[nextIndex].focus();
    });
  });
})();
