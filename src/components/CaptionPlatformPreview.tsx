import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, MessageSquare, Repeat2, Globe, Copy, Check } from "lucide-react";

interface InstagramPreviewProps {
  imageUrl: string;
  caption: string;
  hashtags?: string;
  username?: string;
  variant: string;
}

interface LinkedInPreviewProps {
  imageUrl: string;
  post: string;
  hashtags?: string;
  name?: string;
  headline?: string;
  variant: string;
}

const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return { copied, copy };
};

export const InstagramPreview = ({
  imageUrl,
  caption,
  hashtags = "",
  username = "yourhandle",
  variant,
}: InstagramPreviewProps) => {
  const { copied, copy } = useCopy();
  const fullCaption = hashtags ? `${caption}\n\n${hashtags}` : caption;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl w-full max-w-md mx-auto lg:max-w-none h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-950 p-[2px]">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-300 to-purple-400" />
            </div>
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{username}</p>
            <p className="text-[11px] text-zinc-500">Original audio</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
      </div>

      {/* Image */}
      <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
        <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
      </div>

      {/* Action bar */}
      <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-zinc-900 dark:text-zinc-100 hover:text-red-500 cursor-pointer transition-colors" />
          <MessageCircle className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
          <Send className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
        </div>
        <Bookmark className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
      </div>

      {/* Likes */}
      <div className="px-3 pt-1">
        <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
          {Math.floor(Math.random() * 4000 + 500).toLocaleString()} likes
        </p>
      </div>

      {/* Caption */}
      <div className="px-3 pt-1 pb-2 text-[13px] text-zinc-900 dark:text-zinc-100 leading-snug">
        <span className="font-semibold mr-1.5">{username}</span>
        <span className="whitespace-pre-wrap">
          {expanded || fullCaption.length < 125
            ? fullCaption.split(/(#\w+)/g).map((part, i) =>
                part.startsWith("#") ? (
                  <span key={i} className="text-blue-900 dark:text-blue-400">{part}</span>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )
            : (
              <>
                {fullCaption.slice(0, 125)}
                <button
                  onClick={() => setExpanded(true)}
                  className="text-zinc-500 ml-1 hover:underline"
                >
                  ... more
                </button>
              </>
            )}
        </span>
      </div>

      {/* View comments */}
      <div className="px-3 pb-1">
        <p className="text-[13px] text-zinc-500">View all {Math.floor(Math.random() * 200 + 12)} comments</p>
      </div>

      {/* Time */}
      <div className="px-3 pb-3">
        <p className="text-[10px] text-zinc-400 uppercase tracking-wide">2 hours ago</p>
      </div>

      {/* Copy button */}
      <div className="mt-auto">
      <button
        onClick={() => copy(fullCaption)}
        className="w-full py-2.5 text-xs font-bold border-t border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-fuchsia-500/10 transition-all flex items-center justify-center gap-1.5"
      >
        {copied ? (
          <><Check className="w-3.5 h-3.5 text-green-500" /> Copied {variant} caption!</>
        ) : (
          <><Copy className="w-3.5 h-3.5" /> Copy {variant} caption</>
        )}
      </button>
      </div>
    </div>
  );
};

export const LinkedInPreview = ({
  imageUrl,
  post,
  hashtags = "",
  name = "Your Name",
  headline = "Your Headline · Open to opportunities",
  variant,
}: LinkedInPreviewProps) => {
  const { copied, copy } = useCopy();
  const fullPost = hashtags ? `${post}\n\n${hashtags}` : post;
  const [expanded, setExpanded] = useState(false);
  const previewLength = 280;
  const showSeeMore = fullPost.length > previewLength;

  const renderPost = (text: string) =>
    text.split(/(#\w+|@\w+)/g).map((part, i) => {
      if (part.startsWith("#") || part.startsWith("@")) {
        return (
          <span key={i} className="text-[#0a66c2] font-semibold hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });

  return (
    <div className="rounded-lg overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl w-full max-w-xl mx-auto lg:max-w-none h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-3 pb-2">
        <div className="flex items-start gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center text-white font-bold text-base shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="leading-tight">
            <p className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 hover:text-[#0a66c2] cursor-pointer">
              {name}
            </p>
            <p className="text-[12px] text-zinc-600 dark:text-zinc-400 line-clamp-1">{headline}</p>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5">
              <span>2h</span>
              <span>·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-zinc-600 dark:text-zinc-400 shrink-0" />
      </div>

      {/* Post text */}
      <div className="px-4 pb-2 text-[14px] text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-wrap">
        {expanded || !showSeeMore ? (
          renderPost(fullPost)
        ) : (
          <>
            {renderPost(fullPost.slice(0, previewLength))}
            <span className="text-zinc-500">...</span>
            <button
              onClick={() => setExpanded(true)}
              className="text-zinc-600 dark:text-zinc-400 font-semibold ml-1 hover:text-[#0a66c2] hover:underline"
            >
              see more
            </button>
          </>
        )}
      </div>

      {/* Image */}
      <div className="bg-zinc-100 dark:bg-zinc-800 overflow-hidden border-y border-zinc-200 dark:border-zinc-700">
        <img src={imageUrl} alt="Post" className="w-full max-h-[500px] object-contain" />
      </div>

      {/* Reactions count */}
      <div className="px-4 pt-2 pb-1.5 flex items-center justify-between text-[12px] text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-[#0a66c2] flex items-center justify-center text-white">
              <ThumbsUp className="w-2.5 h-2.5 fill-white" />
            </div>
            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">
              ❤
            </div>
            <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-white text-[8px]">
              💡
            </div>
          </div>
          <span className="ml-1 hover:text-[#0a66c2] hover:underline cursor-pointer">
            {Math.floor(Math.random() * 800 + 50)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hover:underline cursor-pointer">{Math.floor(Math.random() * 50 + 5)} comments</span>
          <span>·</span>
          <span className="hover:underline cursor-pointer">{Math.floor(Math.random() * 20 + 2)} reposts</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-2 py-1 border-t border-zinc-200 dark:border-zinc-700 grid grid-cols-4 gap-1">
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageSquare, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-1.5 py-2 rounded-md text-[12px] font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Copy button */}
      <div className="mt-auto">
        <button
          onClick={() => copy(fullPost)}
          className="w-full py-2.5 text-xs font-bold border-t border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-blue-500/10 transition-all flex items-center justify-center gap-1.5"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5 text-green-500" /> Copied {variant} post!</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy {variant} post</>
          )}
        </button>
      </div>
    </div>
  );
};
