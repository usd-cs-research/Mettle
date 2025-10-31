import React, { useEffect, useState } from 'react';
import ProblemCard from './problemCard';
import LogoutButton from '../global/logoutButton';
import { useLocation } from 'react-router-dom';

export default function SelectProblemMainSection() {
  const [questionData, setQuestionsData] = useState([]);
  const apiurl = process.env.REACT_APP_API_URL;

  const sessionId = useLocation().pathname.replace('/selectproblem', '');

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const getAllProblems = async () => {
      try {
        const response = await fetch(`${apiurl}/question/main/student`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (isMounted && Array.isArray(data.questions)) {
          setQuestionsData(data.questions);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error(error);
      }
    };

    getAllProblems();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [apiurl]);

  return (
    <>
      <div className="info">Here are some estimation problems for you to solve!</div>
      <div className="problemcards--container">
        {questionData.map((question, key) => {
          const data = {
            question: question.question,
            imgurl: `${apiurl}/${question.image}`,
            id: question._id,
          };
          const type = 'student';
          return (
            <ProblemCard
              key={question._id ?? key}
              data={data}
              type={type}
              sessionId={sessionId}
              role={localStorage.getItem('role')}
            />
          );
        })}
      </div>
      <LogoutButton />
    </>
  );
}
