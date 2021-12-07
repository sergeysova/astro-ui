import React, { FC } from 'react';
import cn from 'classnames';

import styles from './loader.module.scss';

const PRELOADER = (
  <svg
    width="400"
    height="240"
    viewBox="0 0 400 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M351.986 124.186C352.129 119.963 348.655 115.543 341.527 111.202C334.469 106.903 324.124 102.868 311.215 99.3258C285.411 92.2449 249.559 87.1843 209.783 85.8398C170.007 84.4953 133.894 87.1234 107.671 92.4457C94.553 95.1083 83.9586 98.4355 76.6264 102.248C69.2215 106.098 65.4571 110.273 65.3144 114.496C65.1716 118.72 68.6454 123.14 75.7735 127.481C82.8316 131.78 93.177 135.815 106.086 139.357C131.89 146.438 167.742 151.499 207.518 152.843C247.294 154.188 283.406 151.559 309.629 146.237C322.748 143.574 333.342 140.247 340.674 136.435C348.079 132.585 351.843 128.41 351.986 124.186Z"
        stroke="#201F1F"
        strokeWidth="1.75958"
      />
      <path
        d="M382.266 47.8082C381.167 45.2197 378.909 43.1154 375.47 41.5225C372.025 39.9268 367.451 38.8728 361.842 38.3695C350.626 37.3631 335.466 38.5744 317.403 41.8428C281.291 48.3771 233.772 63.0966 183.419 84.4636C133.066 105.831 89.4633 129.778 59.673 151.209C44.7719 161.929 33.3671 171.99 26.298 180.756C22.7629 185.139 20.3424 189.161 19.0963 192.748C17.8525 196.328 17.7969 199.414 18.8953 202.002C19.9937 204.591 22.2518 206.695 25.6907 208.288C29.1358 209.884 33.7105 210.938 39.3191 211.441C50.5349 212.447 65.6952 211.236 83.7582 207.968C119.87 201.433 167.389 186.714 217.742 165.347C268.095 143.98 311.698 120.032 341.488 98.6015C356.389 87.8818 367.794 77.8203 374.863 69.0549C378.398 64.6715 380.819 60.6491 382.065 57.0627C383.309 53.4828 383.364 50.3967 382.266 47.8082Z"
        stroke="#201F1F"
        strokeWidth="1.75958"
      />
      <circle className={styles.ellipse1} r="4.69222" fill="#FF8743" />
      <circle className={styles.ellipse2} r="4.69222" fill="#FF8743" />
      <circle className={styles.ellipse4} r="4.69222" fill="#FF8743" />
      <circle className={styles.ellipse3} r="4.69222" fill="#FF8743" />
      <circle
        cx="115.074"
        cy="199.221"
        r="14.0767"
        transform="rotate(-2.61158 115.074 199.221)"
        fill="#CFF9EA"
      />
      <path
        d="M121.968 195.916L110.37 196.445L107.588 205.027L119.492 204.484C119.728 204.473 121.968 195.916 121.968 195.916Z"
        fill="#0C422A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M112.585 196.343L113.7 192.506C113.935 191.697 114.918 191.387 115.575 191.915C116.564 192.709 117.165 193.889 117.226 195.155L117.273 196.129L124.077 195.819C124.077 195.819 121.499 204.391 121.601 204.387L109.697 204.93L112.48 196.348L112.585 196.343Z"
        fill="#19D992"
      />
      <circle
        cx="350.858"
        cy="37.3425"
        r="14.0767"
        transform="rotate(-2.61158 350.858 37.3425)"
        fill="#FFF3EC"
      />
      <path
        d="M344.754 42.5524L356.352 42.0234L359.134 33.4417L347.23 33.9847C346.994 33.9954 344.754 42.5524 344.754 42.5524Z"
        fill="#401700"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M354.191 42.1237L353.233 45.4203C352.997 46.2298 352.015 46.5398 351.358 46.0118C350.369 45.2176 349.768 44.0381 349.707 42.7717L349.685 42.3292L342.645 42.6504C342.645 42.6504 345.223 34.078 345.121 34.0826L357.025 33.5397L354.242 42.1214L354.191 42.1237Z"
        fill="#FF8743"
      />
      <line
        x1="160.362"
        y1="92.2845"
        x2="138.755"
        y2="162.958"
        stroke="#201F1F"
        strokeWidth="1.75958"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M295.598 28.674L201.491 34.7442L196.407 51.4286L171.256 53.0509L150.656 120.651L244.764 114.58L249.848 97.8961L274.999 96.2738L295.598 28.674Z"
        fill="#6038D0"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="400" height="240" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

interface LoaderProps {
  title?: string;
  className?: string;
}

export const Loader: FC<LoaderProps> = ({
  title = 'Receiving data from the contract',
  className = '',
}) => {
  return (
    <div className={cn(styles.root, className)}>
      <div className={styles.logo}>{PRELOADER}</div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.subtitle}>This may take some time</div>
    </div>
  );
};
