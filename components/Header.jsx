import { Button } from './ui/button'
import { Search, ChevronDown } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function Header({ user }) {
  return (
    <header className="bg-[#2DD4BF] text-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
      {/* Left side - Profile and Welcome */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Profile Picture */}
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Welcome Message */}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl font-medium text-white truncate">
            Welcome back, {user.name}
          </h1>
          <p className="text-white/80 text-xs md:text-sm hidden sm:block">
            Let's take a detailed look at your financial situation today
          </p>
        </div>
      </div>

      {/* Right side - Search and User Profile */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search Button - hidden on mobile */}
        <Button 
          variant="outline" 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white hidden md:flex"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>

        {/* Search Button - mobile only */}
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white md:hidden p-2"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-white font-medium text-sm">{user.name}</p>
            <p className="text-white/70 text-xs">User</p>
          </div>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-white/70 hidden md:block" />
        </div>
      </div>
    </header>
  )
}