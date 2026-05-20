import { useEffect } from "react";
import { useBranding } from "@/lib/branding";

/**
 * Injects SEO meta tags + custom head/body code + GTM/GA/Facebook Pixel
 * snippets based on the branding settings.
 *
 * Runs on every public page (mounted in PublicLayout).
 */
export default function SeoInjector() {
  const b = useBranding();

  useEffect(() => {
    if (!b) return;

    // ----- META TAGS -----
    const title = b.seoTitle || b.siteName;
    if (title) document.title = title;

    const ensureMeta = (selector: string, attr: "name" | "property", attrVal: string, content: string) => {
      if (!content) return;
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (b.seoDescription) ensureMeta('meta[name="description"]', "name", "description", b.seoDescription);
    if (b.seoKeywords) ensureMeta('meta[name="keywords"]', "name", "keywords", b.seoKeywords);
    if (b.seoAuthor) ensureMeta('meta[name="author"]', "name", "author", b.seoAuthor);

    // Open Graph
    if (title) ensureMeta('meta[property="og:title"]', "property", "og:title", title);
    if (b.seoDescription) ensureMeta('meta[property="og:description"]', "property", "og:description", b.seoDescription);
    if (b.seoOgImage) ensureMeta('meta[property="og:image"]', "property", "og:image", b.seoOgImage);
    ensureMeta('meta[property="og:type"]', "property", "og:type", "website");

    // Twitter
    ensureMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    if (title) ensureMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    if (b.seoDescription) ensureMeta('meta[name="twitter:description"]', "name", "twitter:description", b.seoDescription);
    if (b.seoOgImage) ensureMeta('meta[name="twitter:image"]', "name", "twitter:image", b.seoOgImage);

    // ----- ANALYTICS -----
    const removePrev = (id: string) => {
      document.querySelectorAll(`[data-seo-id="${id}"]`).forEach((n) => n.remove());
    };

    // Google Tag Manager
    removePrev("gtm");
    if (b.gtmId) {
      const gtmScript = document.createElement("script");
      gtmScript.setAttribute("data-seo-id", "gtm");
      gtmScript.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${b.gtmId}');`;
      document.head.appendChild(gtmScript);

      const noscript = document.createElement("noscript");
      noscript.setAttribute("data-seo-id", "gtm");
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${b.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(noscript, document.body.firstChild);
    }

    // Google Analytics (GA4)
    removePrev("ga");
    if (b.gaId) {
      const gaLoader = document.createElement("script");
      gaLoader.setAttribute("data-seo-id", "ga");
      gaLoader.async = true;
      gaLoader.src = `https://www.googletagmanager.com/gtag/js?id=${b.gaId}`;
      document.head.appendChild(gaLoader);

      const gaInit = document.createElement("script");
      gaInit.setAttribute("data-seo-id", "ga");
      gaInit.text = `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${b.gaId}');`;
      document.head.appendChild(gaInit);
    }

    // Facebook Pixel
    removePrev("fbq");
    if (b.facebookPixelId) {
      const fbScript = document.createElement("script");
      fbScript.setAttribute("data-seo-id", "fbq");
      fbScript.text = `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${b.facebookPixelId}');
        fbq('track', 'PageView');`;
      document.head.appendChild(fbScript);

      const noscript = document.createElement("noscript");
      noscript.setAttribute("data-seo-id", "fbq");
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${b.facebookPixelId}&ev=PageView&noscript=1"/>`;
      document.body.appendChild(noscript);
    }

    // ----- CUSTOM HEAD/BODY CODE -----
    removePrev("custom-head");
    if (b.headCode) {
      const container = document.createElement("div");
      container.setAttribute("data-seo-id", "custom-head");
      container.style.display = "none";
      container.innerHTML = b.headCode;
      // Move scripts to head so they execute
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-seo-id", "custom-head");
      wrapper.innerHTML = b.headCode;
      Array.from(wrapper.children).forEach((child) => {
        if (child.tagName === "SCRIPT") {
          const s = document.createElement("script");
          for (const attr of Array.from(child.attributes)) s.setAttribute(attr.name, attr.value);
          s.setAttribute("data-seo-id", "custom-head");
          s.text = child.textContent || "";
          document.head.appendChild(s);
        } else {
          child.setAttribute("data-seo-id", "custom-head");
          document.head.appendChild(child);
        }
      });
    }

    removePrev("custom-body");
    if (b.bodyCode) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = b.bodyCode;
      Array.from(wrapper.children).forEach((child) => {
        if (child.tagName === "SCRIPT") {
          const s = document.createElement("script");
          for (const attr of Array.from(child.attributes)) s.setAttribute(attr.name, attr.value);
          s.setAttribute("data-seo-id", "custom-body");
          s.text = child.textContent || "";
          document.body.appendChild(s);
        } else {
          child.setAttribute("data-seo-id", "custom-body");
          document.body.appendChild(child);
        }
      });
    }
  }, [b]);

  return null;
}
