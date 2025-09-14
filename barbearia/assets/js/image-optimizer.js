/**
 * Script para otimização de imagens
 * Este script implementa técnicas de carregamento lazy e otimização de imagens
 */

document.addEventListener('DOMContentLoaded', function() {
    // Implementar lazy loading para imagens
    const lazyLoadImages = () => {
        // Verificar se o navegador suporta Intersection Observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        
                        // Parar de observar a imagem após carregá-la
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Selecionar todas as imagens com atributo data-src
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores que não suportam Intersection Observer
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const lazyLoad = () => {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(img => {
                    if (img.offsetTop < window.innerHeight + scrollTop) {
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                    }
                });
                
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationchange', lazyLoad);
                }
            };
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationchange', lazyLoad);
            lazyLoad();
        }
    };
    
    // Converter imagens para formato WebP quando suportado
    const checkWebpSupport = () => {
        const webpTest = new Image();
        webpTest.onload = function() {
            const supportsWebp = (webpTest.width > 0) && (webpTest.height > 0);
            if (supportsWebp) {
                document.documentElement.classList.add('webp-support');
                convertImagesToWebp();
            }
        };
        webpTest.onerror = function() {
            document.documentElement.classList.add('no-webp-support');
        };
        webpTest.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    };
    
    // Converter imagens para WebP
    const convertImagesToWebp = () => {
        const images = document.querySelectorAll('img[data-webp]');
        
        images.forEach(img => {
            const webpSrc = img.getAttribute('data-webp');
            if (webpSrc) {
                if (img.getAttribute('data-src')) {
                    img.setAttribute('data-src', webpSrc);
                } else {
                    img.src = webpSrc;
                }
            }
        });
    };
    
    // Implementar carregamento responsivo de imagens
    const setupResponsiveImages = () => {
        const responsiveImages = document.querySelectorAll('img[data-srcset]');
        
        responsiveImages.forEach(img => {
            const srcset = img.getAttribute('data-srcset');
            if (srcset) {
                img.setAttribute('srcset', srcset);
                img.removeAttribute('data-srcset');
            }
        });
    };
    
    // Inicializar todas as funções de otimização
    const initImageOptimization = () => {
        lazyLoadImages();
        checkWebpSupport();
        setupResponsiveImages();
    };
    
    // Executar a otimização de imagens
    initImageOptimization();
});