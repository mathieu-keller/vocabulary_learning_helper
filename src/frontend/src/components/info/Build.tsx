import React from 'react';
import packageJson from '../../../package.json';
import GitHubIcon from '@material-ui/icons/GitHub';

const Build = (): JSX.Element => {
  const dependencies = Object.keys(packageJson.dependencies);
  const devDependencies = Object.keys(packageJson.devDependencies);
  return (
    <div>
      <h2>Source Code:</h2>
      <GitHubIcon /> <a href='https://github.com/Afrima/vocabulary_learning_helper' rel='noreferrer' target='_blank'>https://github.com/Afrima/vocabulary_learning_helper</a>
      <h2>Dependencies:</h2>
      <ul>
        {dependencies.map(dep => <li key={dep}><a href={`https://www.npmjs.com/package/${dep}`} rel='noreferrer' target='_blank'>{dep}</a></li>)}
      </ul>
      <h2>Dev Dependencies:</h2>
      <ul>
        {devDependencies.map(dep => <li key={dep}><a href={`https://www.npmjs.com/package/${dep}`} rel='noreferrer' target='_blank'>{dep}</a></li>)}
      </ul>
    </div>
  );
};

export default Build;
