import React, { Component, useRef, useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import $ from 'jquery'
import { SpinningCircles } from 'react-loading-icons'

import axios from 'axios'

import Webcam from 'react-webcam'

// axios.defaults.baseURL = 'https://localhost:3000'
axios.defaults.baseURL = 'https://med.piomedical.co.kr:3000/'

export default function Camera() {
    const [image, setImage] = useState('')

    const [imageData, setImageData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [rgb0, setRgb0] = useState(null)
    const [rgb1, setRgb1] = useState(null)
    const [rgb2, setRgb2] = useState(null)

    useEffect(() => {
        $(document).ready(function () {
            /* OnChange Event*/
            if (!('url' in window) && 'webkitURL' in window) {
                window.URL = window.webkitURL
            }
            $('#camera-input').change(function (e) {
                // $('#pic').attr('src', URL.createObjectURL(e.target.files[0]))
                // var onChange_img = document.getElementById('pic')
                // imageObj.src = URL.createObjectURL(e.target.files[0])
                var reader = new FileReader()
                reader.readAsDataURL(e.target.files[0])
                reader.onloadend = function () {
                    var base64data = reader.result
                    setImage(base64data)
                }
            })
        })
    }, [image])

    const fetchImageData = async () => {
        try {
            // 요청이 시작 할 때에는 error 와 users 를 초기화하고
            setError(null)
            setImageData(null)
            // loading 상태를 true 로 바꿉니다.
            setLoading(true)

            const response = await axios
                .post('/checker', {
                    // imgSrc: '/images/sample_03.png',
                    imgSrc: image,
                })
                .then((res) => {
                    setImageData(res.data.result.toString().split('\n', 13))
                    console.log(res.data.result.toString().split('\n', 13))
                    setRgb0('rgb(' + imageData[5].substring(1, imageData[5].length - 1) + ')')
                    setRgb1('rgb(' + imageData[6].substring(1, imageData[6].length - 1) + ')')
                    setRgb2('rgb(' + imageData[7].substring(1, imageData[7].length - 1) + ')')
                })
        } catch (e) {
            setError(e)
        }
        setLoading(false)
    }

    const videoConstraints = {
        width: 300,
        height: 300,
        // facingMode: "user"
        facingMode: 'environment',
    }

    const webcamRef = useRef(null)
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setImage(imageSrc)
        console.log('Capture')
        //setImage(imageSrc)
    }, [webcamRef])

    //downloadURI(imageSrc, 'imageObj.png');
    const downloadURI = (uri, name) => {
        var link = document.createElement('a')
        link.download = name
        link.href = uri
        console.log(link.href)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // delete link;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>확인하기</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {loading ? (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 2,
                        background: 'rgba(0,0,0,0.7)',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        // visibility: 'hidden',
                    }}
                >
                    <SpinningCircles style={{ height: '100%' }} />
                </div>
            ) : (
                <div></div>
            )}

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <div className={styles.description}>내 몸을 바로잡는 습관</div>
                    <Link href="/">
                        <a>
                            <span className={styles.mainColor}>PIO</span> 심플체커
                        </a>
                    </Link>
                </h1>

                <h4>가이드 라인에 맞추어 촬영을 해주세요!</h4>

                <div>
                    <div
                        style={{
                            position: 'relative',
                            width: '300px',
                            height: '300px',
                            borderTop: '100px solid rgba(0,0,0,0.7)',
                            borderBottom: '100px solid rgba(0,0,0,0.7)',
                            borderLeft: '50px solid rgba(0,0,0,0.7)',
                            borderRight: '50px solid rgba(0,0,0,0.7)',
                            zIndex: '1',
                            marginBottom: '-300px',
                        }}
                    />
                    {image == '' ? (
                        <img
                            style={{
                                position: 'relative',
                                width: '300px',
                                height: '300px',
                                objectFit: 'cover',
                            }}
                            src="/resource/00_XXO.png"
                        />
                    ) : (
                        <img
                            style={{
                                position: 'relative',
                                width: '300px',
                                height: '300px',
                                objectFit: 'cover',
                            }}
                            src={image}
                        />
                    )}
                </div>

                {image != '' ? (
                    <div>
                        <button
                            className={styles.buttonReverse}
                            onClick={(e) => {
                                e.preventDefault()
                                setImage('')
                                setImageData('')
                                //Clear Color
                                setRgb0(null)
                                setRgb1(null)
                                setRgb2(null)
                            }}
                        >
                            다시찍기
                        </button>
                        <button className={styles.buttonMain} onClick={fetchImageData}>
                            검사하기
                        </button>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="camera-input">
                            <div className={styles.capture}>촬영하기</div>
                        </label>
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            id="camera-input"
                            name="camera"
                            capture="camera"
                            accept="image/*"
                        />
                    </div>
                )}
                <div>
                    {!imageData ? (
                        ''
                    ) : (
                        <>
                            {JSON.parse(imageData[1].toLowerCase()) ? (
                                <div>
                                    {/* <div
                                        style={{
                                            display: 'flex',
                                            width: '200px',
                                            height: '50px',
                                            background: '#efefef',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '3px',
                                                height: '50px',
                                                margin: '0px 15px 0px 50px',
                                                background: rgb0,
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: '3px',
                                                height: '50px',
                                                margin: '0px 30px',
                                                background: rgb1,
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: '3px',
                                                height: '50px',
                                                margin: '0px 50px 0px 15px',
                                                background: rgb2,
                                            }}
                                        />
                                    </div> */}
                                    <div className={styles.description}>결과</div>
                                    <div style={{ marginTop: '20px', fontSize: '21px', lineHeight: '34px' }}>
                                        PDG농도 <span style={{ color: '#E50921' }}>8ug/ml </span>입니다.
                                        <br />
                                        임신여부<span style={{ color: '#E50921', fontWeight: 'bold' }}> 양성</span>
                                        입니다.
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', margin: '10px' }}>
                                    QR코드를 확인할 수 없습니다.
                                    <br />
                                    재촬영 부탁드립니다.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <footer className={styles.footer}>
                <a href="https://piomedical.co.kr" target="_blank" rel="noopener noreferrer">
                    © 2021.<span className={styles.mainColor}> PIOMEDICAL.</span> All rights reserved.{' '}
                </a>
            </footer>
        </div>
    )
}
