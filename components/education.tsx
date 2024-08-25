import React, { useState, useEffect } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import './css/Education.css';  // Import your custom CSS

interface EducationProps {
    // You can define props if necessary, like the topic or any other parameter
}

const Education: React.FC<EducationProps> = () => {
    const [blogContent, setBlogContent] = useState<string | null>(() => {
        // Check if the content is already in session storage
        const savedContent = sessionStorage.getItem('blogContent');
        return savedContent ? savedContent : null;
    });
    const [fetching, setFetching] = useState<boolean>(false);

    useEffect(() => {
        const fetchBlogPost = async () => {
            if (fetching || blogContent) return; // Don't fetch if already fetching or content is available

            setFetching(true);
            try {
                console.log('Fetching blog post...');
                const response = await axios.post('https://stenio-api.fly.dev/getBlogPost', {
                    topic: 'Churn'  // Replace with the desired topic
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    responseType: 'text'
                });

                setBlogContent(response.data);
                sessionStorage.setItem('blogContent', response.data); // Save the content to session storage
                console.log('Blog post fetched:', response.data);
            } catch (error) {
                console.error('Error fetching blog post:', error);
                setBlogContent('<p>Erro ao carregar o conteúdo do blog.</p>');
            } finally {
                setFetching(false);
            }
        };

        fetchBlogPost();
    }, [blogContent, fetching]); // Run the effect only when blogContent or fetching changes

    return (
        <div className="education-container">
            {blogContent ? (
                <div className="blog-content">
                    {parse(blogContent)}  {/* Use parse to convert the HTML string into React components */}
                </div>
            ) : (
                <p>Carregando conteúdo...</p>
            )}
        </div>
    );
};

export default Education;
