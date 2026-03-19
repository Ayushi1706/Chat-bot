const Skeleton = ({ className = "" }) => (
    <div className={`animate-pulse bg-light-hover dark:bg-dark-hover rounded-xl ${className}`} />
  );
  
  // Conversation item skeleton for sidebar
  export const ConversationSkeleton = () => (
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
  
  // Message skeleton for chat area
  export const MessageSkeleton = () => (
    <div className="space-y-4 p-4">
      {/* AI message */}
      <div className="flex justify-start gap-2">
        <div className="space-y-2 max-w-sm w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      {/* User message */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-48" />
      </div>
      {/* AI message */}
      <div className="flex justify-start">
        <div className="space-y-2 max-w-md w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
  
  export default Skeleton;