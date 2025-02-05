import { createContext, useContext, useState } from "react";
const MusicContext = createContext();
export function MusicProvider({ children }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(50);
	const startMusic = () => setIsPlaying(true);
	const stopMusic = () => setIsPlaying(false);
	const adjustVolume = (newVolume) => setVolume(newVolume);
	return (
		<MusicContext.Provider
			value={{ isPlaying, startMusic, stopMusic, volume, adjustVolume }}
		>
			{children}
			{/* Hidden Music Player */}
			{isPlaying && (
				<div className="fixed top-0 left-0 w-0 h-0 overflow-hidden opacity-0">
					<iframe
						width="0"
						height="0"
						src={`https://www.youtube.com/embed/FTeRgZkMkN0?autoplay=1&loop=1&playlist=FTeRgZkMkN0&controls=0`}
						title="Background Music"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
			)}
		</MusicContext.Provider>
	);
}
export function useMusic() {
	const context = useContext(MusicContext);
	if (!context) {
		throw new Error("useMusic must be used within a MusicProvider");
	}
	return context;
}
