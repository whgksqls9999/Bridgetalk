const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    entry: { main: './src/main.tsx' },
    output: {
        filename: 'bundle.js', // filename: 번들링 파일명
        path: path.resolve(__dirname, 'dist'), // path: 번들링 파일 생성 경로
        publicPath: '/',
        clean: true, // clean: 기존 번들링 결과물 삭제 옵션
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'], // 다음의 확장자를 가진 파일들의 경우
        alias: {
            '@': path.resolve(__dirname, './src'), // '@'를 통해 절대경로로 접근할 수 있게 한다
        },
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/, // 타입스크립트 파일의 경우
                include: path.resolve(__dirname, './src'),
                use: {
                    loader: 'ts-loader', // ts-loader를 통해 로드한다.
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.json'), // 관련 설정은 루트디렉토리의 tsconfig.json을 따른다.
                    },
                },
            },
            {
                test: /\.(js|jsx)$/, // 자바스크립트 파일의 경우
                exclude: /node_modules/, // 해당 폴더는 탐색하지 않는다.
                use: {
                    loader: 'babel-loader', // 바벨 로더를 통해 로드한다.
                },
            },
            {
                test: /\.css$/, // css 파일의 경우
                use: ['style-loader', 'css-loader'], // css-loader, style-loader 순서로 활용해 로드한다.
                include: path.resolve(__dirname, './src/main.css'), // src 폴더 내부 main.css만 탐색한다
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i, // 해당 확장자의 파일의 경우
                type: 'asset/resource', // 별도의 파일을 내보내고 URL을 추출한다.
            },
        ],
    },
    performance: {
        hints: false, // 번들링 최적화 문제로 발생하는 경고문구 무시
    },
    plugins: [
        new HtmlWebpackPlugin({
            // HtmlWebpackPlugin: 번들링 결과물 생성
            template: 'public/index.html',
        }),
        new FaviconsWebpackPlugin({
            // manifest, logo 파일 번들링 결과물에 포함
            logo: path.resolve(__dirname, 'public/blender.png'),
            manifest: path.resolve(__dirname, 'public/manifest.json'),
        }),
        new webpack.DefinePlugin({
            // DefinePlugin: 환경 변수 env 파일 인식
            'process.env': JSON.stringify(process.env),
            // 'process.env.development': JSON.stringify(process.env.development),
        }),
        new CopyWebpackPlugin({
            // CopyWebpackplugin: 정적 asset 파일 빌드시 복사
            patterns: [{ from: 'public', to: 'assets/' }],
        }),
        new ImageMinimizerPlugin({
            // ImageMinimizerPlugin: 이미지 파일 용량 최적화 플러그인
            exclude: /node_modules/,
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    plugins: [['optipng', { optimizationLevel: 1 }]], // optipng: png 파일 최적화
                },
            },
        }),
    ],
};

// console.log(JSON.stringify(process.env));
// console.log(JSON.stringify(process.env.development));
// console.log(JSON.stringify(process.env.production));