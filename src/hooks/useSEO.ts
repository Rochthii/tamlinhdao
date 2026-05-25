import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'book' | 'profile';
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export default function useSEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/og-image.jpg',
  jsonLd
}: SEOProps) {
  useEffect(() => {
    // 1. Cập nhật Title
    const formattedTitle = title.includes('ĐẠO') ? title : `${title} | ĐẠO | Triết Lý Tâm Linh & Luận Mệnh`;
    document.title = formattedTitle;

    // Helper cập nhật hoặc tạo thẻ meta
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper cập nhật hoặc tạo thẻ link
    const setLinkTag = (relVal: string, hrefVal: string) => {
      let element = document.querySelector(`link[rel="${relVal}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', relVal);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefVal);
    };

    // 2. Cập nhật Meta Description
    const activeDescription = description || 'Nơi hội tụ triết lý Đạo Giáo, Phật Pháp và Cổ học phương Đông giúp bạn tìm lại sự tĩnh tại và thấu suốt vận mệnh.';
    setMetaTag('name', 'description', activeDescription);

    // 3. Cập nhật Open Graph (OG) Meta Tags
    const activeUrl = canonical || window.location.href;
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', activeDescription);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', activeUrl);
    setMetaTag('property', 'og:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);

    // 4. Cập nhật Canonical Link
    setLinkTag('canonical', activeUrl);

    // 5. Cập nhật Dữ liệu cấu trúc JSON-LD động
    let scriptElement: HTMLScriptElement | null = null;
    if (jsonLd) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.id = 'dynamic-jsonld';
      scriptElement.innerHTML = JSON.stringify(jsonLd);
      document.head.appendChild(scriptElement);
    }

    // Cleanup khi chuyển trang (unmount)
    return () => {
      if (scriptElement && document.getElementById('dynamic-jsonld')) {
        scriptElement.remove();
      }
    };
  }, [title, description, canonical, ogType, ogImage, jsonLd]);
}
