import { useQuery } from '@tanstack/react-query';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Heading, Stack, Text, Skeleton } from '@chakra-ui/react';
import { fetchLessons } from '../api/content';
import type { Lesson } from '../types';

const Lessons = () => {
  const { data, isLoading, error } = useQuery<Lesson[]>({
    queryKey: ['lessons'],
    queryFn: fetchLessons
  });

  if (isLoading) {
    return <Skeleton height="200px" borderRadius="lg" />;
  }

  if (error) {
    return (
      <Stack spacing={3}>
        <Heading size="lg">Lessons</Heading>
        <Text color="red.500">Failed to load lessons: {error.message}</Text>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <Heading size="lg">Lessons</Heading>
      <Accordion allowToggle>
        {data?.map((lesson, index) => (
          <AccordionItem key={lesson.title ?? index}>
            <h2>
              <AccordionButton>
                <Text flex="1" textAlign="left" fontWeight="semibold">
                  {lesson.title}
                </Text>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text fontWeight="medium" mb={2}>
                {lesson.description}
              </Text>
              <Text whiteSpace="pre-wrap">{lesson.content}</Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  );
};

export default Lessons;
