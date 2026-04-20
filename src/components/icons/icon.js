import React from 'react';
import PropTypes from 'prop-types';

import IconAppStore from './appstore';
import IconBookmark from './bookmark';
import IconCodepen from './codepen';
import IconCyber from './cyber';
import IconExternal from './external';
import IconFolder from './folder';
import IconFork from './fork';
import IconGitHub from './github';
import IconInstagram from './instagram';
import IconLinkedin from './linkedin';
import IconLoader from './loader';
import IconLogo from './logo';
import IconPlayStore from './playstore';
import IconStar from './star';
import IconTwitter from './twitter';
import IconHex from './hex';

const Icon = ({ name }) => {
  switch (name) {
    case 'AppStore':
      return <IconAppStore />;
    case 'Bookmark':
      return <IconBookmark />;
    case 'Codepen':
      return <IconCodepen />;
    case 'Cyber':
      return <IconCyber />;
    case 'External':
      return <IconExternal />;
    case 'Folder':
      return <IconFolder />;
    case 'Fork':
      return <IconFork />;
    case 'GitHub':
      return <IconGitHub />;
    case 'Hex':
      return <IconHex />;
    case 'Instagram':
      return <IconInstagram />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Loader':
      return <IconLoader />;
    case 'Logo':
      return <IconLogo />;
    case 'PlayStore':
      return <IconPlayStore />;
    case 'Star':
      return <IconStar />;
    case 'Twitter':
      return <IconTwitter />;
    default:
      return <IconExternal />;
  }
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
