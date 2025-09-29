import { useQuery } from '@tanstack/react-query';
import { Stack, Heading, Text, Skeleton, Card, CardHeader, CardBody } from '@chakra-ui/react';
import { fetchBlogPosts } from '../api/content';
import type { BlogPost } from '../types';

const Blog = () => {
  const { data, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: fetchBlogPosts
  });

  if (isLoading) {
    return <Skeleton height="200px" borderRadius="lg" />;
  }

  if (error) {
    return (
      <Stack spacing={3}>
        <Heading size="lg">Blog</Heading>
        <Text color="red.500">Failed to load blog posts: {error.message}</Text>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Heading size="lg">Blog</Heading>
      {data?.map((post) => (
        <Card key={post.id} bg="white" borderRadius="lg" shadow="sm">
          <CardHeader>
            <Heading size="md">{post.title}</Heading>
            <Text fontSize="sm" color="gray.500">
              {post.author ?? 'StockLive Team'} • {post.datePosted ? new Date(post.datePosted).toLocaleDateString() : 'Recently'}
            </Text>
          </CardHeader>
          <CardBody>
            <Text whiteSpace="pre-wrap">{post.content}</Text>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
};

export default Blog;
