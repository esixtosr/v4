import React, { useEffect, useMemo, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledCertificatesSection = styled.section`
  max-width: 1200px;

  .certificates-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    margin-top: 40px;
    align-items: stretch;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const StyledCertificateCard = styled.li`
  .certificate-card {
    ${({ theme }) => theme.mixins.boxShadow};
    display: grid;
    grid-template-columns: 88px 1fr;
    gap: 22px;
    align-items: start;
    padding: 24px;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    height: 100%;
    min-height: 320px;

    &:hover,
    &:focus-within {
      transform: translateY(-6px);
    }

    @media (max-width: 640px) {
      grid-template-columns: 80px 1fr;
      gap: 18px;
      padding: 20px;
      min-height: auto;
    }
  }
  .certificate-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .certificate-image-link {
    display: block;
    width: 88px;
    height: 88px;
    border-radius: 18px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(100, 255, 218, 0.08);
    transition: var(--transition);

    &:hover,
    &:focus {
      transform: translateY(-2px);
    }

    @media (max-width: 640px) {
      width: 80px;
      height: 80px;
    }
  }

  .certificate-image,
  .certificate-image-fallback {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    background-color: rgba(255, 255, 255, 0.02);
  }

  .certificate-title-link {
    display: inline-block;
    margin: 0 0 8px;
    color: var(--lightest-slate);
    font-size: clamp(22px, 1.8vw, 26px);
    font-weight: 700;
    line-height: 1.2;
    transition: var(--transition);

    &:hover,
    &:focus {
      color: var(--green);
    }
  }

  .certificate-issuer {
    margin: 0 0 20px;
    color: var(--light-slate);
    font-size: clamp(17px, 1.1vw, 19px);
    line-height: 1.4;
  }

  .certificate-dates {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, auto));
    gap: 10px 22px;
    margin-bottom: 18px;
    font-family: var(--font-mono);

    .label {
      color: var(--light-slate);
      font-size: var(--fz-xxs);
      margin-bottom: 6px;
    }

    .value {
      color: var(--lightest-slate);
      font-size: var(--fz-xs);
    }
  }

  .certificate-status {
    margin-bottom: 16px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--green);
  }

  .certificate-link {
    margin-top: auto;
    align-self: flex-start;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    text-decoration: none;
    position: relative;
    transition: var(--transition);

    &:hover,
    &:focus {
      color: var(--green);
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 100%;
      height: 1px;
      background-color: var(--green);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.25s ease;
    }

    &:hover:after,
    &:focus:after {
      transform: scaleX(1);
    }
  }
`;

const Certificates = () => {
  const revealTitle = useRef(null);
  const revealCards = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const data = useStaticQuery(graphql`
    query {
      certificates: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/certificates/" } }
      ) {
        edges {
          node {
            frontmatter {
              title
              issuer
              issued
              expires
              link
              image
              status
            }
          }
        }
      }

      certificateImages: allFile(
        filter: { absolutePath: { regex: "/content/certificates/images/" } }
      ) {
        edges {
          node {
            base
            publicURL
            childImageSharp {
              gatsbyImageData(
                width: 88
                height: 88
                quality: 100
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
      }
    }
  `);

  const certOrder = {
    'Cisco Certified Network Associate (CCNA)': 1,
    'CompTIA Security+': 2,
    'Google Project Management Certificate': 3,
    'Google Cybersecurity Certificate': 4,
    'Google IT Support Certificate': 5,
  };

  const certificateData = [...data.certificates.edges].sort((a, b) => {
    const aTitle = a.node.frontmatter?.title || '';
    const bTitle = b.node.frontmatter?.title || '';
    const aOrder = certOrder[aTitle] ?? 999;
    const bOrder = certOrder[bTitle] ?? 999;
    return aOrder - bOrder;
  });

  const imageMap = useMemo(() => {
    const map = {};
    data.certificateImages.edges.forEach(({ node }) => {
      map[node.base.trim()] = {
        imageData: node.childImageSharp ? getImage(node.childImageSharp) : null,
        publicURL: node.publicURL,
      };
    });
    return map;
  }, [data.certificateImages.edges]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealCards.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  return (
    <StyledCertificatesSection id="certificates">
      <h2 className="numbered-heading" ref={revealTitle}>
        Certificates
      </h2>

      <ul className="certificates-grid">
        {certificateData.map(({ node }, i) => {
          const { title, issuer, issued, expires, link, image, status } = node.frontmatter;
          const badge = image ? imageMap[image.trim()] : null;

          return (
            <StyledCertificateCard key={i} ref={el => (revealCards.current[i] = el)}>
              <div className="certificate-card">
                <a
                  className="certificate-image-link"
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open credential for ${title}`}>
                  {badge?.imageData ? (
                    <GatsbyImage
                      image={badge.imageData}
                      alt={`${title} badge`}
                      className="certificate-image"
                    />
                  ) : badge?.publicURL ? (
                    <img
                      src={badge.publicURL}
                      alt={`${title} badge`}
                      className="certificate-image-fallback"
                    />
                  ) : (
                    <div className="certificate-image-fallback" />
                  )}
                </a>

                <div className="certificate-content">
                  <a
                    className="certificate-title-link"
                    href={link}
                    target="_blank"
                    rel="noreferrer">
                    {title}
                  </a>

                  <p className="certificate-issuer">{issuer}</p>

                  <div className="certificate-dates">
                    <div>
                      <div className="label">Issued</div>
                      <div className="value">{issued}</div>
                    </div>
                    <div>
                      <div className="label">Expires</div>
                      <div className="value">{expires}</div>
                    </div>
                  </div>

                  {status && <div className="certificate-status">● {status}</div>}

                  <a className="certificate-link" href={link} target="_blank" rel="noreferrer">
                    View Credential
                  </a>
                </div>
              </div>
            </StyledCertificateCard>
          );
        })}
      </ul>
    </StyledCertificatesSection>
  );
};

export default Certificates;
