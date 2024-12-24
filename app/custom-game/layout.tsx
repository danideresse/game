'use client';

export default function CustomGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-20">
      {children}
    </div>
  );
} 