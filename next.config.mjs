/** @type {import('next').NextConfig} */
const nextConfig = {
  
  experimenta:{
  serverActions: true,
    swcPlugins: [['next-superjson-plugin', {}]],
  },
   
  reactStrictMode: false,
  images:{
    remotePatterns:[
        {
            hostname:'**',
            protocol:'https'
        }
    ]
  }
}
export default nextConfig;
