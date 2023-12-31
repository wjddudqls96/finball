package com.example.backend.service;

import com.example.backend.dto.TokenDto;
import com.example.backend.security.jwt.HeaderTokenExtractor;
import com.example.backend.security.jwt.JwtDecoder;
import com.example.backend.security.jwt.JwtTokenUtils;
import javax.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final HeaderTokenExtractor extractor;
    private final JwtDecoder jwtDecoder;
    private final JwtTokenUtils jwtTokenUtils;

    public TokenDto.Response reissue(HttpServletRequest request) throws IllegalAccessException {
        String tokenPayLoad = request.getHeader("Authorization");
        String token = extractor.extract(tokenPayLoad, request);
        String userId = jwtDecoder.decodeUsername(token);
        TokenDto.Response response = jwtTokenUtils.reissueToken(userId, token);

        return response;
    }


    public void logout(HttpServletRequest request) {
        String tokenPayLoad = request.getHeader("Authorization");
        String token = extractor.extract(tokenPayLoad, request);
        String userId = jwtDecoder.decodeUsername(token);
        jwtTokenUtils.logout(userId);
    }
}
