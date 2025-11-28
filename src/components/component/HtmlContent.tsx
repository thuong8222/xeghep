import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

export default function HtmlContent({ html }: { html?: string }) {
  const { width } = useWindowDimensions();
  const source = { html: html || '' };

  return (
    <RenderHTML
      contentWidth={width}
      source={source}
      // tùy chỉnh: map tag p -> style AppText nếu cần
      tagsStyles={{
        p: {       marginBottom: 8, lineHeight: 20 },
        a: { color: '#1e88e5' },
      }}
      // nếu cần render <img> tốt hơn: enableExperimentalPercentWidth={true}
    />
  );
}
