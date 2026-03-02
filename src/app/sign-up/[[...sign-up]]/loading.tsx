export default function SignUpLoading() {
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
              Join FlashyCardyCourse
            </h1>
            <p className="text-xl text-purple-100">
              Create your account and start learning today
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
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="space-y-3 mt-8">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
