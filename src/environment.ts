console.info(`frontend-ws in ${process.env.NODE_ENV} mode`);

export const ENVIRONMENT = process.env.NODE_ENV === 'development' ? {
    productionMode: false,
    authServiceUrl: 'https://localhost:8443',
    billingServiceUrl: 'https://localhost:8443/work/billing',
    baseUrl: ""
  } : {
    productionMode: true,
    authServiceUrl: '/api/backend',
    billingServiceUrl: '/api/backend/work/billing',
    baseUrl: "/ui"
  }
