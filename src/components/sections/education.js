import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledEducationSection = styled.section`
  max-width: 1000px;

  .inner {
    display: grid;
    grid-template-columns: minmax(310px, 460px) minmax(0, 1fr);
    gap: 70px;
    align-items: center;

    @media (max-width: 1080px) {
      gap: 40px;
    }

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  width: 104%;
  max-width: 580px;
  justify-self: start;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
    width: 75%;
    max-width: 420px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(80%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const StyledText = styled.div`
  .school {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    margin-bottom: 12px;
  }

  .degree {
    margin: 0 0 8px;
    color: var(--lightest-slate);
    font-size: clamp(24px, 4vw, 32px);
    line-height: 1.2;
  }

  .meta {
    margin-bottom: 24px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .education-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(160px, 220px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 25px 0 0 0;
    list-style: none;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;

const Education = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  const highlights = [
    'Expected May 2026',
    'West Lafayette, Indiana',
    'Cybersecurity',
    'Network Engineering',
    'Systems Administration',
    'Technical Documentation',
  ];

  return (
    <StyledEducationSection id="education" ref={revealContainer}>
      <h2 className="numbered-heading">Education</h2>

      <div className="inner">
        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/purdue.png"
              width={700}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Purdue University entrance arch"
            />
          </div>
        </StyledPic>

        <StyledText>
          <p className="school">Purdue University Polytechnic Institute</p>
          <h3 className="degree">B.S. in Cybersecurity &amp; Network Engineering</h3>
          <p className="meta">Expected Graduation: May 2026</p>

          <p>
            I am pursuing a degree focused on cybersecurity, network engineering, systems
            administration, and practical technical problem-solving.
          </p>

          <p>
            My coursework and project work emphasize secure infrastructure, troubleshooting,
            technical documentation, and hands-on lab experience across networking and security
            environments.
          </p>

          <ul className="education-list">
            {highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </StyledText>
      </div>
    </StyledEducationSection>
  );
};

export default Education;
