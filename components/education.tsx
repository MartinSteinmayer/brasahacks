import React, { useState, useEffect } from 'react';
import axios from 'axios';
import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import './css/Education.css';  // Import your custom CSS
import { blogPosts } from './blogPosts';
import { set } from 'date-fns';

const exampleTopics = [
    "Churn",
    "Capital de Giro",
    "Estratégia de Precificação",
    "Fluxo de Caixa",
];

const Education: React.FC = () => {
    const [blogContent, setBlogContent] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [fetchingText, setFetchingText] = useState<boolean>(false);
    const [fetchingImage, setFetchingImage] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const cleanContent = (content: string) => {
        // Remove ```html or ``` from the start or end
        return content.replace(/```html|```/g, '').trim();
    };

    const fetchBlogPost = async (topic: string) => {
        if (fetchingText || fetchingImage) return; // Prevent fetching if already in progress

        setFetchingText(true);
        setImageSrc(null); // Reset image source when fetching a new topic

        try {
            console.log(`Fetching blog post for topic: ${topic}`);
            const response = await axios.post('https://stenio-api.fly.dev/getBlogText', {
                topic: topic
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const { blog_content, image_description } = response.data;
            setBlogContent(cleanContent(blog_content));

            console.log('Blog post fetched:', blog_content);

            // Start fetching the image after the blog content is displayed
            //fetchBlogImage(image_description);

        } catch (error) {
            console.error('Error fetching blog post:', error);
            setBlogContent('<p>Erro ao carregar o conteúdo do blog.</p>');
        } finally {
            setFetchingText(false);
        }
    };

    const fetchBlogImage = async (description: string) => {
        setFetchingImage(true);
        try {
            console.log(`Fetching blog image for description: ${description}`);
            const response = await axios.post('https://stenio-api.fly.dev/getBlogImage', {
                description: description
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'blob' // Fetch the image as a blob
            });

            // Create a URL for the image blob and set it as the image source
            const imageUrl = URL.createObjectURL(response.data);
            setImageSrc(imageUrl);
            console.log('Blog image fetched');

        } catch (error) {
            console.error('Error fetching blog image:', error);
        } finally {
            setFetchingImage(false);
        }
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            fetchBlogPost(searchTerm);
        }
    };

    const handleExampleClick = (topic: string) => {
        setSearchTerm(topic);
        const post = blogPosts[topic];
        setBlogContent(post.content);
        setImageSrc(post.imageSrc);
    };

    // Function to insert the image below the <h1> tag
    const insertImageAfterTitle = (content: string) => {
        return parse(content, {
            replace: (domNode: DOMNode) => {
                if (domNode instanceof Element && domNode.tagName === 'h1') {
                    return (
                        <>
                            {domToReact([domNode])}
                            {imageSrc && <img src={imageSrc} alt="Blog related" className="blog-image" />}
                        </>
                    );
                }
            }
        });
    };

    return (
        <div className="education-container">
            <div className="search-bar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite um tópico..."
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Buscar</button>
            </div>

            <div className="example-buttons">
                {exampleTopics.map((topic, index) => (
                    <button
                        key={index}
                        onClick={() => handleExampleClick(topic)}
                        className="example-button"
                    >
                        {topic}
                    </button>
                ))}
            </div>

            <div className="blog-content-container">
                {fetchingText ? (
                    <p>Carregando conteúdo...</p>
                ) : (
                    blogContent && (
                        <div className="blog-content">
                            {insertImageAfterTitle(blogContent)}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Education;
