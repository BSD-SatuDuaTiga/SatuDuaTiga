export default function Chat({ messages, playerName, handleSubmit, messageSent, setMessageSent }) {
  return (
    <>
      {/* Chat Section */}
      <div className="chat-container w-96 flex flex-col">
        <div className="chat-header p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-white">Game Chat</h2>
        </div>

        <div className="chat-messages flex-grow p-4 overflow-auto h-[400px]">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.from === playerName ? "flex justify-end" : "flex justify-start"}`}>
              <div className={`message-bubble ${msg.from === playerName ? "message-own" : "message-other"}`}>
                <div className="text-xs mb-1 opacity-80">{msg.from === playerName ? "You" : msg.from}</div>
                <div className="break-words">{msg.message}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700 rounded-b-lg">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={messageSent}
              onChange={(e) => setMessageSent(e.target.value)}
              type="text"
              placeholder="Ketik pesan Anda..."
              className="flex-grow p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={!messageSent.trim()} className={`px-6 py-2 rounded-lg transition-colors ${messageSent.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}>
              Kirim
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
