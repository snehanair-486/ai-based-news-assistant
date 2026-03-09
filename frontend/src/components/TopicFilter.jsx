import { TOPICS } from "../constants";

export default function TopicFilter({ selectedTopic, onTopicChange, disabled }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {TOPICS.map(topic => (
        <button
          key={topic}
          onClick={() => onTopicChange(topic)}
          disabled={disabled}
          className={`topic-chip ${selectedTopic === topic ? "active" : ""}`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}