import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Purple Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-400 rounded-full opacity-20"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-purple-300 rounded-full opacity-15"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-400 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-purple-300 rounded-full opacity-25"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">LOGO</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Sign In
            </h1>
            <p className="text-xl text-purple-100">
              Sign in to continue access
            </p>
          </div>
          
          <div className="text-purple-200">
            www.flashycardycourse.com
          </div>
        </div>
      </div>

      {/* Right Column - White Background */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtons: "hidden",
                divider: "hidden",
                formButtonPrimary: "w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2",
                formFieldInput: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all",
                footerActionLink: "text-purple-600 hover:text-purple-700 font-medium",
              }
            }}
            routing="path"
            path="/sign-in"
          />

        </div>
      </div>
    </div>
  );
}
