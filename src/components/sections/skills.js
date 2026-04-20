import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { Icon } from '@components/icons';

const StyledSkillsSection = styled.section`
  max-width: 1000px;

  .skills-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-top: 50px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const StyledSkillCard = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .skill-inner {
        transform: translateY(-7px);
        box-shadow: 0 10px 30px -15px var(--navy-shadow);
      }

      .accent-bar {
        width: 100%;
        opacity: 1;
      }

      .card-title {
        color: var(--green);
      }

      .card-description li {
        transform: translateX(4px);
      }

      .card-top .card-icon {
        transform: scale(1.08);
      }
    }
  }

  .skill-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    height: 100%;
    padding: 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: hidden;
  }

  .accent-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 72px;
    height: 3px;
    background: var(--green);
    opacity: 0.8;
    transition: var(--transition);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .card-icon {
      color: var(--green);
      transition: var(--transition);

      svg {
        width: 34px;
        height: 34px;
      }
    }
  }

  .card-title {
    margin: 0 0 14px;
    color: var(--lightest-slate);
    font-size: clamp(22px, 2vw, 26px);
    line-height: 1.2;
    transition: var(--transition);
  }

  .card-description {
    color: var(--light-slate);
    font-size: var(--fz-md);
    line-height: 1.75;
  }

  .card-description ul {
    ${({ theme }) => theme.mixins.resetList};
    margin: 0;
    padding: 0;
  }

  .card-description li {
    position: relative;
    margin-bottom: 14px;
    padding-left: 18px;
    transition: var(--transition);

    &:last-child {
      margin-bottom: 0;
    }

    &:before {
      content: '▹';
      position: absolute;
      left: 0;
      color: var(--green);
      font-family: var(--font-mono);
    }
  }
`;

const Skills = () => {
  const revealTitle = useRef(null);
  const revealCards = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const data = useStaticQuery(graphql`
    query {
      skills: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/content/skills/" } }) {
        edges {
          node {
            frontmatter {
              title
            }
            html
          }
        }
      }
    }
  `);

  const titleOrder = {
    'Cybersecurity & Networking': 1,
    'Systems & Infrastructure': 2,
    'Governance, Risk & Compliance': 3,
    'Scripting & Automation': 4,
    'Scripting & Technical Workflow': 4,
  };

  const skillsData = [...data.skills.edges].sort((a, b) => {
    const aTitle = a.node.frontmatter?.title || '';
    const bTitle = b.node.frontmatter?.title || '';
    const aOrder = titleOrder[aTitle] ?? 999;
    const bOrder = titleOrder[bTitle] ?? 999;
    return aOrder - bOrder;
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealCards.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  const getIconName = title => {
    switch (title) {
      case 'Cybersecurity & Networking':
        return 'Codepen';
      case 'Systems & Infrastructure':
        return 'Folder';
      case 'Governance, Risk & Compliance':
        return 'Bookmark';
      case 'Scripting & Automation':
        return 'Fork';
      default:
        return 'Hex';
    }
  };

  return (
    <StyledSkillsSection id="skills">
      <h2 className="numbered-heading" ref={revealTitle}>
        Technical Skills
      </h2>

      <ul className="skills-grid">
        {skillsData.map(({ node }, i) => {
          const { frontmatter, html } = node;
          const { title } = frontmatter;

          return (
            <StyledSkillCard key={i} ref={el => (revealCards.current[i] = el)}>
              <div className="skill-inner">
                <div className="accent-bar" />
                <div className="card-top">
                  <div className="card-icon">
                    <Icon name={getIconName(title)} />
                  </div>
                </div>

                <h3 className="card-title">{title}</h3>

                <div className="card-description" dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </StyledSkillCard>
          );
        })}
      </ul>
    </StyledSkillsSection>
  );
};

export default Skills;
