import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { EmailList } from "@/components/dashboard/EmailList";
import { EmailDetail } from "@/components/dashboard/EmailDetail";
import { MOCK_EMAILS } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { logout } = useAuth();
  
  // Dashboard State
  const [selectedFolder, setSelectedFolder] = useState<string>("inbox");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  // Filter emails based on selected folder
  const filteredEmails = useMemo(() => {
    if (selectedFolder === "starred") {
        return MOCK_EMAILS.filter(e => e.isStarred);
    }
    return MOCK_EMAILS.filter((email) => email.folder === selectedFolder);
  }, [selectedFolder]);

  // Get current selected email object
  const selectedEmail = useMemo(() => {
    return MOCK_EMAILS.find((e) => e.id === selectedEmailId) || null;
  }, [selectedEmailId]);

  return (
    // Main Container: Full viewport height, no body scroll
    <div className="flex h-screen w-full overflow-hidden bg-background">
      
      {/* COLUMN 1: SIDEBAR (Hidden on mobile) */}
      <aside className="hidden md:flex w-64 flex-col flex-shrink-0 border-r">
        <Sidebar 
            selectedFolder={selectedFolder} 
            onSelectFolder={(id) => {
                setSelectedFolder(id);
                setSelectedEmailId(null); // Reset selection when changing folder
            }} 
        />
        {/* Logout button at bottom of sidebar */}
        <div className="p-4 border-t bg-muted/20">
            <button onClick={logout} className="text-sm font-medium text-red-600 hover:underline">
                Sign out
            </button>
        </div>
      </aside>

      {/* COLUMN 2: EMAIL LIST */}
      {/* Logic: On mobile, hide this list if an email is selected (to show detail view) */}
      <div className={`flex-1 md:flex md:w-[400px] md:flex-none flex-col border-r bg-background
         ${selectedEmailId ? "hidden md:flex" : "flex"} 
      `}>
        <EmailList 
            emails={filteredEmails} 
            selectedEmailId={selectedEmailId}
            onSelectEmail={setSelectedEmailId}
        />
      </div>

      {/* COLUMN 3: EMAIL DETAIL */}
      {/* Logic: On mobile, only show this if an email is selected */}
      <main className={`flex-1 flex-col bg-background
          ${!selectedEmailId ? "hidden md:flex" : "flex"}
      `}>
         {/* Mobile Back Button */}
         {selectedEmailId && (
             <div className="md:hidden p-2 border-b flex items-center">
                 <button onClick={() => setSelectedEmailId(null)} className="text-sm font-medium text-blue-600 px-2 py-1">
                    &larr; Back to list
                 </button>
             </div>
         )}
         <EmailDetail email={selectedEmail} />
      </main>
    </div>
  );
}