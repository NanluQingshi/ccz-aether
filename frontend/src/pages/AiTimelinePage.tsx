import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getAiTimeline } from '../api/posts';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useUiStore } from '../store/uiStore';
import type { PostVO } from '../types/post';

function formatEventDate(dateStr: string): string {
  // yyyy-MM-dd → 精确日期；yyyy-MM → 年月
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return format(parseISO(dateStr), 'yyyy年MM月dd日', { locale: zhCN });
  }
  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    return format(parseISO(dateStr + '-01'), 'yyyy年MM月', { locale: zhCN });
  }
  return dateStr;
}

function groupByYear(posts: PostVO[]): Record<string, PostVO[]> {
  return posts.reduce<Record<string, PostVO[]>>((acc, post) => {
    const year = post.eventDate ? post.eventDate.slice(0, 4) : '未知';
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});
}

const AiTimelinePage: React.FC = () => {
  const [posts, setPosts] = useState<PostVO[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useUiStore();

  useEffect(() => {
    getAiTimeline()
      .then((r) => setPosts(r.data))
      .catch(() => addToast('加载失败，请刷新重试', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const grouped = groupByYear(posts);
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="container page-content">
      <div className="ai-page-header">
        <h1 className="page-title">AI 大事纪</h1>
        <p className="ai-page-desc">
          记录人工智能发展历程中的关键时刻与里程碑事件
        </p>
      </div>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : posts.length === 0 ? (
        <p className="empty-state">暂无内容</p>
      ) : (
        <div className="timeline">
          {years.map((year) => (
            <div key={year} className="timeline-year-group">
              <div className="timeline-year-label">{year}</div>
              <div className="timeline-events">
                {grouped[year].map((post, idx) => (
                  <div key={post.id} className="timeline-item">
                    <div className="timeline-dot" />
                    {idx < grouped[year].length - 1 && (
                      <div className="timeline-line" />
                    )}
                    <div className="timeline-content">
                      {post.eventDate && (
                        <span className="timeline-date">
                          {formatEventDate(post.eventDate)}
                        </span>
                      )}
                      <h3 className="timeline-title">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      {post.summary && (
                        <p className="timeline-summary">{post.summary}</p>
                      )}
                      <div className="timeline-meta">
                        {post.tags.length > 0 && (
                          <div className="timeline-tags">
                            {post.tags.map((t) => (
                              <span key={t.id} className="tag">{t.name}</span>
                            ))}
                          </div>
                        )}
                        <Link to={`/blog/${post.slug}`} className="timeline-read-more">
                          阅读详情 <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiTimelinePage;
