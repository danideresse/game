import React from 'react'

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  if (!title) {
    console.warn('PageContainer: title prop is required')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <h1 className="text-2xl font-bold text-text-dark border-b pb-3 mb-4">
        {title}
      </h1>
      <div className="bg-white shadow-custom rounded-lg p-6">
        {children}
      </div>
    </div>
  )
}

PageContainer.displayName = 'PageContainer'
export default PageContainer
