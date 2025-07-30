export function detectPlatform(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android.*(?!.*mobile)/i.test(userAgent);
  
  if (isTablet || isMobile) return 'mobile';
  return 'desktop';
} 