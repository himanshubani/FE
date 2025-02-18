"use client";
import { Appbar } from '@/components/Appbar';
import { BACKEND_URL } from '@/utils';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

async function getTaskDetails(taskId: string) {
    const response = await axios.get(`${BACKEND_URL}/v1/user/task?taskId=${taskId}`, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    });
    return response.data;
}

export default function Page() {
    const { taskId } = useParams<{ taskId: string }>();  // Use useParams to get taskId

    const [result, setResult] = useState<Record<string, {
        count: number;
        option: {
            imageUrl: string
        }
    }>>({});
    
    const [taskDetails, setTaskDetails] = useState<{ title?: string }>({});

    useEffect(() => {
        if (!taskId) return; // Don't fetch if taskId is invalid
    
        const fetchTaskDetails = () => {
            getTaskDetails(taskId)
                .then((data) => {
                    setResult(data.result);
                    setTaskDetails(data.taskDetails);
                })
                .catch(console.error);
        };
    
        fetchTaskDetails();
    
        const intervalId = setInterval(fetchTaskDetails, 5000);
    
        return () => {
            clearInterval(intervalId);
        };
    }, [taskId]);

    return (
        <div>
            <Appbar />
            <div className='text-2xl pt-20 flex justify-center'>
                {taskDetails.title}
            </div>
            <div className='flex justify-center pt-8'>
                {Object.keys(result || {}).map(id => (
                    <Task key={id} imageUrl={result[id].option.imageUrl} votes={result[id].count} />
                ))}
            </div>
        </div>
    );
}

function Task({ imageUrl, votes }: { imageUrl: string; votes: number }) {
    return (
        <div>
            <Image width={384} height={200} className="p-2 rounded-md" src={imageUrl} alt="image.jpg" />
            <div className='flex justify-center'>{votes}</div>
        </div>
    );
}
